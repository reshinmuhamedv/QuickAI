import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const authResult = await req.auth();
    const { userId, has } = authResult || {};

    if (!userId) {
      return res.status(401).json({ success: false, message: 'No user ID found' });
    }

    // Store userId in request object for use in controllers
    req.userId = userId;
    req.authResult = authResult;

    const hasPremiumPlan = await has({ plan: 'premium' });
    const user = await clerkClient.users.getUser(userId);

    if (!hasPremiumPlan && user.privateMetadata?.free_usage != null) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }

    req.plan = hasPremiumPlan ? 'premium' : 'free';
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
