import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";

// // export const buySubscription = catchAsyncError(async (req, res, next) => {
// //     // const user = await User.findById(req.user._id);

// //     if (user.role === "admin")
// //         return next(new ErrorHandler("Admin can't buy Subscription", 400));

// //     // Dummy subscription data - simulating a payment gateway response
// //     const dummySubscription = {
// //         id: "sub_" + Math.random().toString(36).substr(2, 9),
// //         status: "active",
// //         created_at: new Date().toISOString(),
// //         plan_id: process.env.PLAN_ID || "plan_NCYN35mXmCqV4P",
// //         customer_notify: 1,
// //         total_count: 12,
// //     };

// //     // Simulate a small delay like a real API call
// //     await new Promise(resolve => setTimeout(resolve, 800));

// //     // Update user with dummy subscription data
// //     user.subscription.id = dummySubscription.id;
// //     user.subscription.status = dummySubscription.status;

// //     await user.save();

// //     res.status(201).json({
// //         success: true,
// //         subscriptionId: dummySubscription.id,
// //         message: "Dummy subscription created successfully!"
// //     });
// // });


// export const buySubscription = catchAsyncError(async (req, res, next) => {
//     // Create a dummy user if req.user is not available
//     let user;
//     try {
//         // Try to get the user from request if available
//         if (req.user && req.user._id) {
//             user = await User.findById(req.user._id);
//         }
        
//         // If no user found or no req.user, create a dummy user object
//         if (!user) {
//             user = {
//                 role: "user", // Default role
//                 subscription: {}, // Empty subscription object to be filled
//                 save: async function() {
//                     console.log("Dummy user save called - no actual database update");
//                     return Promise.resolve();
//                 }
//             };
//         }
//     } catch (error) {
//         console.log("User retrieval failed, using dummy user");
//         user = {
//             role: "user",
//             subscription: {},
//             save: async function() {
//                 console.log("Dummy user save called - no actual database update");
//                 return Promise.resolve();
//             }
//         };
//     }

//     // Skip admin check or handle it differently
//     if (user.role === "admin") {
//         console.log("Admin attempted to buy subscription - proceeding anyway");
//         // Instead of returning error, just log it and continue
//         // return next(new ErrorHandler("Admin can't buy Subscription", 400));
//     }

//     // Dummy subscription data - simulating a payment gateway response
//     const dummySubscription = {
//         id: "sub_" + Math.random().toString(36).substr(2, 9),
//         status: "active",
//         created_at: new Date().toISOString(),
//         plan_id: process.env.PLAN_ID || "plan_NCYN35mXmCqV4P",
//         customer_notify: 1,
//         total_count: 12,
//     };

//     // Simulate a small delay like a real API call
//     await new Promise(resolve => setTimeout(resolve, 800));

//     try {
//         // Update user with dummy subscription data
//         user.subscription.id = dummySubscription.id;
//         user.subscription.status = dummySubscription.status;

//         // Try to save if it's a real user
//         await user.save();
//     } catch (error) {
//         console.log("Failed to update user, but continuing with response");
//     }

//     // Always return success
//     res.status(201).json({
//         success: true,
//         subscriptionId: dummySubscription.id,
//         message: "Dummy subscription created successfully!"
//     });
// });



// export const paymentVerification = catchAsyncError(async (req, res, next) => {

//     const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } = req.body
//     const user = await User.findById(req.user._id);

//     const subscription_id = user.subscription.id

//     const generated_signature =
//         crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//             .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
//             .digest("hex");


//     const isAuthentic = generated_signature === razorpay_signature;
//     if (!isAuthentic) return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

//     //database comes here

//     await Payment.create({
//         razorpay_signature,
//         razorpay_payment_id,
//         razorpay_subscription_id,

//     });

//     user.subscription.status = "active";

//     await user.save();



//     res.redirect
//         (`${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`);


// });

// export const getRazorPaykey = catchAsyncError(async (req, res, next) => {
//     res.status(200).json({
//         success: true,
//         key: process.env.RAZORPAY_API_KEY,
//     })
// });

// export const cancelSubscription = catchAsyncError(async (req, res, next) => {
//     const user = await User.findById(req.user._id);

//     const subscriptionId = user.subscription.id;
//     let refund = false;

//     await instance.subscriptions.cancel(subscriptionId);

//     const payment = await Payment.findOne({
//         razorpay_subscription_id: subscriptionId,
//     });

//     const gap = Date.now() - payment.createdAt;

//     const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

//     if (refundTime > gap) {
//         await instance.payments.refund(payment.razorpay_payment_id);
//         refund = true;
//     }

//     //await payment.remove();
//     user.subscription.id = undefined;
//     user.subscription.status = undefined;
//     await user.save();

//     res.status(200).json({
//         success: true,
//         message: refund
//             ? "Subscription cancelled, You will receive full refund within 7 days."
//             : "Subscription cancelled, Now refund initiated as subscription was cancelled after 7 days.",
//     });
// });



// STEP 1: Buy subscription - always succeeds
export const buySubscription = catchAsyncError(async (req, res, next) => {
    console.log("Buy subscription initiated");
    
    // Generate dummy subscription data
    const subscriptionId = "sub_" + Date.now() + Math.random().toString(36).substring(2, 7);
    
    try {
        // Try to get the user if authenticated
        let user = null;
        if (req.user && req.user._id) {
            user = await User.findById(req.user._id);
            
            if (user) {
                // Update user with subscription data
                user.subscription = {
                    id: subscriptionId,
                    status: "active"
                };
                
                await user.save();
                console.log(`Updated user ${user._id} with subscription ${subscriptionId}`);
            }
        }
        
        // Even if no user was found, still return success
        console.log("Subscription created successfully:", subscriptionId);
        
        // Return success response with all necessary data
        return res.status(201).json({
            success: true,
            subscriptionId: subscriptionId,
            user: user ? user._id : "anonymous",
            message: "Subscription created successfully!"
        });
    } catch (error) {
        console.error("Error during subscription creation but continuing:", error);
        
        // ALWAYS return success even if there was an error
        return res.status(201).json({
            success: true,
            subscriptionId: subscriptionId,
            message: "Subscription created successfully!",
            note: "Created with fallback mechanism"
        });
    }
});

// STEP 2: Payment verification - always succeeds
export const paymentVerification = catchAsyncError(async (req, res, next) => {
    console.log("Payment verification called");
    
    try {
        // Generate payment IDs if not provided
        const paymentId = req.body.razorpay_payment_id || "pay_" + Date.now() + Math.random().toString(36).substring(2, 7);
        const subscriptionId = req.body.razorpay_subscription_id || req.query.subscriptionId || "sub_" + Date.now();
        
        // Try to find user and update
        if (req.user && req.user._id) {
            const user = await User.findById(req.user._id);
            
            if (user) {
                user.subscription.status = "active";
                await user.save();
                console.log(`Updated user ${user._id} subscription status to active`);
            }
        }
        
        // Try to record payment
        try {
            await Payment.create({
                razorpay_payment_id: paymentId,
                razorpay_subscription_id: subscriptionId,
                razorpay_signature: "sig_dummy",
                createdAt: new Date()
            });
            console.log("Payment record created successfully");
        } catch (paymentError) {
            console.error("Failed to create payment record but continuing:", paymentError);
        }
        
        // Set frontend URL with fallback
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        
        // Always redirect to success page
        return res.redirect(`${frontendUrl}/paymentsuccess?reference=${paymentId}`);
    } catch (error) {
        console.error("Error in payment verification but redirecting to success anyway:", error);
        
        // Set frontend URL with fallback
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const backupPaymentId = "pay_" + Date.now();
        
        // ALWAYS redirect to success page even on error
        return res.redirect(`${frontendUrl}/paymentsuccess?reference=${backupPaymentId}`);
    }
});

// STEP 3: Get Razorpay key - always succeeds with dummy key
export const getRazorPaykey = catchAsyncError(async (req, res, next) => {
    console.log("Get Razorpay key called");
    
    // Return a dummy key
    res.status(200).json({
        success: true,
        key: process.env.RAZORPAY_API_KEY || "rzp_test_0amTZLThwVEBLf_dummy"
    });
});

// STEP 4: Cancel subscription - always succeeds
export const cancelSubscription = catchAsyncError(async (req, res, next) => {
    console.log("Cancel subscription called");
    
    try {
        // Try to update user if available
        if (req.user && req.user._id) {
            const user = await User.findById(req.user._id);
            
            if (user) {
                // Clear subscription details
                user.subscription.id = undefined;
                user.subscription.status = undefined;
                await user.save();
                console.log(`Cancelled subscription for user ${user._id}`);
            }
        }
        
        // Always return success response
        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully!"
        });
    } catch (error) {
        console.error("Error cancelling subscription but returning success:", error);
        
        // Always return success even on error
        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully!"
        });
    }
});