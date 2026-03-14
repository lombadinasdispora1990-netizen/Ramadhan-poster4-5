-- ============================================
-- Add Credits and Subscriptions
-- ============================================

-- Add columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_credit_refresh DATE DEFAULT CURRENT_DATE;

-- Payments table for Mayar logs
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mayar_payment_id TEXT UNIQUE,
  amount DECIMAL(12, 2),
  status TEXT, -- 'pending', 'success', 'failed'
  plan_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  raw_response JSONB
);

-- Enable RLS for payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Function to handle daily credit refresh
CREATE OR REPLACE FUNCTION public.refresh_user_credits(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_is_premium BOOLEAN;
  v_last_refresh DATE;
  v_current_credits INTEGER;
BEGIN
  SELECT is_premium, last_credit_refresh, credits 
  INTO v_is_premium, v_last_refresh, v_current_credits
  FROM profiles 
  WHERE id = target_user_id;

  -- Only refresh if it's a new day
  IF v_last_refresh < CURRENT_DATE THEN
    IF v_is_premium THEN
      -- If premium, we might not want to reset it daily if they have a monthly quota
      -- But the user said 40/month. Let's assume for now they get 40 if they are premium
      -- and it resets daily? No, 40/month is likely a monthly allocation.
      -- If it's a new day, and they are premium, we don't necessarily reset to 40.
      -- However, if free, we reset to 5.
      UPDATE profiles 
      SET last_credit_refresh = CURRENT_DATE
      WHERE id = target_user_id;
    ELSE
      -- Free user daily reset
      UPDATE profiles 
      SET credits = 5, 
          last_credit_refresh = CURRENT_DATE
      WHERE id = target_user_id;
      v_current_credits := 5;
    END IF;
  END IF;

  RETURN v_current_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to consume credit
CREATE OR REPLACE FUNCTION public.consume_credit(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  SELECT credits INTO v_credits FROM profiles WHERE id = target_user_id;
  
  IF v_credits > 0 THEN
    UPDATE profiles 
    SET credits = credits - 1 
    WHERE id = target_user_id
    RETURNING credits INTO v_credits;
  ELSE
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  RETURN v_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
