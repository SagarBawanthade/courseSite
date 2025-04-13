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



// Dummy subscription controller that will work without Razorpay
export const buySubscription = catchAsyncError(async (req, res, next) => {
    let user;
    
    try {
        // Try to get authenticated user if available
        if (req.user && req.user._id) {
            user = await User.findById(req.user._id);
            console.log("Found authenticated user:", user.email || user._id);
        }
        
        // Create dummy user if no real user found
        if (!user) {
            console.log("No authenticated user found, creating dummy user");
            user = {
                _id: "dummy_" + Math.random().toString(36).substr(2, 9),
                role: "user",
                subscription: {},
                save: async function() {
                    console.log("Saving dummy user (no actual DB update)");
                    return Promise.resolve();
                }
            };
        }
    } catch (error) {
        console.log("Failed to retrieve user, using dummy user instead:", error.message);
        user = {
            _id: "dummy_" + Math.random().toString(36).substr(2, 9),
            role: "user",
            subscription: {},
            save: async function() {
                console.log("Saving dummy user (no actual DB update)");
                return Promise.resolve();
            }
        };
    }

    // Generate dummy subscription
    const dummySubscription = {
        id: "sub_" + Math.random().toString(36).substr(2, 9),
        status: "active",
        created_at: new Date().toISOString(),
        plan_id: process.env.PLAN_ID || "plan_dummy123",
        customer_notify: 1,
        total_count: 12,
    };

    console.log("Created dummy subscription:", dummySubscription.id);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Update user subscription details
        user.subscription.id = dummySubscription.id;
        user.subscription.status = "active";
        await user.save();
        console.log("Updated user subscription status to active");
    } catch (error) {
        console.log("Failed to update user subscription but continuing:", error.message);
    }

    // Always return success response
    res.status(201).json({
        success: true,
        subscriptionId: dummySubscription.id,
        message: "Subscription created successfully!",
        dummy: true,
        key: "rzp_test_dummy" // Fake key that won't actually be used
    });
});

// Dummy payment verification that will always succeed
export const paymentVerification = catchAsyncError(async (req, res, next) => {
    console.log("Payment verification called", req.body);
    
    // Extract payment details from request or generate dummy ones
    const razorpay_payment_id = req.body.razorpay_payment_id || "pay_" + Math.random().toString(36).substr(2, 9);
    const razorpay_subscription_id = req.body.razorpay_subscription_id || "sub_" + Math.random().toString(36).substr(2, 9);
    const razorpay_signature = req.body.razorpay_signature || "sig_" + Math.random().toString(36).substr(2, 9);
    
    let user;
    try {
        // Try to get authenticated user
        if (req.user && req.user._id) {
            user = await User.findById(req.user._id);
            console.log("Found user for payment verification:", user.email || user._id);
        }
        
        // Create dummy user if needed
        if (!user) {
            console.log("No user found for payment verification, using dummy");
            user = {
                _id: "dummy_" + Math.random().toString(36).substr(2, 9),
                subscription: { id: razorpay_subscription_id, status: "active" },
                save: async function() {
                    console.log("Saving dummy user payment (no actual DB update)");
                    return Promise.resolve();
                }
            };
        }
    } catch (error) {
        console.log("Error finding user for payment verification:", error.message);
        // Continue with dummy user
        user = {
            _id: "dummy_" + Math.random().toString(36).substr(2, 9),
            subscription: { id: razorpay_subscription_id, status: "active" },
            save: async function() {
                console.log("Saving dummy user payment (no actual DB update)");
                return Promise.resolve();
            }
        };
    }

    try {
        // Try to create payment record in database
        try {
            await Payment.create({
                razorpay_payment_id,
                razorpay_subscription_id,
                razorpay_signature,
                createdAt: new Date()
            });
            console.log("Created payment record in database");
        } catch (dbError) {
            console.log("Failed to create payment record but continuing:", dbError.message);
        }

        // Update user subscription status
        user.subscription.status = "active";
        await user.save();
        console.log("Updated user subscription status after payment verification");
    } catch (error) {
        console.log("Error in payment verification process but continuing:", error.message);
    }

    // Redirect to success page - ALWAYS succeed regardless of any errors
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/paymentsuccess?reference=${razorpay_payment_id}`);
});

// Get Razorpay key - return dummy key if real one not available
export const getRazorPaykey = catchAsyncError(async (req, res, next) => {
    const key = process.env.RAZORPAY_API_KEY || "rzp_test_dummy_key_for_development";
    console.log("Providing Razorpay key:", key);
    
    res.status(200).json({
        success: true,
        key: key
    });
});

// Cancel subscription - always succeed
export const cancelSubscription = catchAsyncError(async (req, res, next) => {
    let user;
    let refund = false;
    
    try {
        // Get user if available
        if (req.user && req.user._id) {
            user = await User.findById(req.user._id);
            console.log("Found user for subscription cancellation:", user.email || user._id);
        }
        
        if (!user) {
            console.log("No user found for subscription cancellation");
            user = {
                subscription: { id: "sub_dummy", status: "active" },
                save: async function() {
                    console.log("Saving dummy cancellation (no actual DB update)");
                    return Promise.resolve();
                }
            };
        }

        // Simulate cancellation logic
        const subscriptionId = user.subscription?.id || "sub_dummy";
        console.log("Cancelling subscription:", subscriptionId);
        
        // Randomly determine if refund should be given (for simulation)
        refund = Math.random() > 0.5;
        
        // Clear subscription details
        user.subscription.id = undefined;
        user.subscription.status = undefined;
        await user.save();
        console.log("Cleared user subscription details");
        
    } catch (error) {
        console.log("Error in subscription cancellation but continuing:", error.message);
    }

    // Always return success
    res.status(200).json({
        success: true,
        message: refund
            ? "Subscription cancelled, You will receive full refund within 7 days."
            : "Subscription cancelled, No refund initiated as subscription was cancelled after 7 days.",
    });
});