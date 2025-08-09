import * as functions from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

initializeApp();

const db = getFirestore();
const auth = getAuth();

// Define secrets
const twilioSid = process.env.TWILIO_SID;
const twilioAuthToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_ACCOUNT_PHONE_NUMBER;
const stripeSecretKey = process.env.STRIPE_ACCOUNT_SECRET_KEY;

export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase! Functions are working!");
});

export const sendVerificationCode = functions.https.onCall(
  async (data, context) => {
    const phoneNumber = data?.data?.phoneNumber || data?.phoneNumber;
    console.log("data==>", data);
    console.log("phoneNumber", phoneNumber);

    if (!phoneNumber) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Phone number is required"
      );
    }

    try {
      // Import Twilio only when needed
      const twilio = (await import("twilio")).default;
      const client = twilio(twilioSid, twilioAuthToken);
      console.log("client", client);

      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const expiresAt = Timestamp.fromDate(
        new Date(Date.now() + 5 * 60 * 1000)
      );

      await db.collection("verificationCodes").doc(phoneNumber).set({
        code: verificationCode,
        expiresAt,
        verified: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      await client.messages.create({
        body: `Your verification code is: ${verificationCode}`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });

      return { success: true, message: "Verification code sent successfully" };
    } catch (error) {
      console.error("Error sending verification code:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to send verification code"
      );
    }
  }
);

export const verifyPhoneNumber = functions.https.onCall(
  async (data, context) => {
    const phoneNumber = data?.data?.phoneNumber || data?.phoneNumber;
    const code = data?.data?.code || data?.code;

    if (!phoneNumber || !code) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Phone number and code are required"
      );
    }

    try {
      const docRef = db.collection("verificationCodes").doc(phoneNumber);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new functions.https.HttpsError(
          "not-found",
          "Verification code not found"
        );
      }

      const docData = doc.data();
      const now = Timestamp.now();

      if (now.toMillis() > docData.expiresAt.toMillis()) {
        throw new functions.https.HttpsError(
          "deadline-exceeded",
          "Verification code has expired"
        );
      }

      if (docData.code !== parseInt(code)) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Invalid verification code"
        );
      }

      if (docData.verified) {
        throw new functions.https.HttpsError(
          "already-exists",
          "Code has already been used"
        );
      }

      await docRef.update({ verified: true });
      const userDoc = await db.collection("user").doc(phoneNumber).get();
      if (!userDoc.exists) {
        await db.collection("user").doc(phoneNumber).set({
          phoneNumber: phoneNumber,
          createdAt: FieldValue.serverTimestamp(),
          verified: false,
          displayName: "",
          profilePicture: "",
        });
      }

      // let userRecord;
      // try {
      //   userRecord = await auth.getUserByPhoneNumber(phoneNumber);
      // } catch (error) {
      //   userRecord = await auth.createUser({
      //     phoneNumber: phoneNumber,
      //   });
      // }

      const customToken = await auth.createCustomToken(userRecord.uid);
      await docRef.delete();

      return {
        success: true,
        customToken,
        uid: userRecord.uid,
        message: "Phone number verified successfully",
      };
    } catch (error) {
      console.error("Error verifying phone number:", error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        "Failed to verify phone number"
      );
    }
  }
);

export const resendVerificationCode = functions.https.onCall(
  async (data, context) => {
    const phoneNumber = data?.data?.phoneNumber || data?.phoneNumber;

    if (!phoneNumber) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Phone number is required"
      );
    }

    try {
      // Import Twilio only when needed
      const twilio = (await import("twilio")).default;
      const client = twilio(twilioSid, twilioAuthToken);

      const docRef = db.collection("verificationCodes").doc(phoneNumber);
      const doc = await docRef.get();

      if (doc.exists) {
        const docData = doc.data();
        const now = Timestamp.now();
        const timeDiff = now.toMillis() - docData.createdAt.toMillis();
        if (timeDiff < 60000) {
          throw new functions.https.HttpsError(
            "resource-exhausted",
            "Please wait before requesting another code"
          );
        }
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const expiresAt = Timestamp.fromDate(
        new Date(Date.now() + 5 * 60 * 1000)
      );

      await docRef.set({
        code: verificationCode,
        expiresAt,
        verified: false,
        createdAt: FieldValue.serverTimestamp(),
      });

      await client.messages.create({
        body: `Your verification code is: ${verificationCode}`,
        from: twilioPhoneNumber,
        to: phoneNumber,
      });

      return {
        success: true,
        message: "Verification code resent successfully",
      };
    } catch (error) {
      console.error("Error resending verification code:", error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        "internal",
        "Failed to resend verification code"
      );
    }
  }
);

export const updateDriverStatus = functions.https.onCall(async (request) => {
  try {
    const { driverId, status } = request.data;

    if (!driverId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "driverId is required"
      );
    }

    if (typeof status !== "boolean") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "status must be true or false"
      );
    }

    const driverRef = database.ref(`drivers/${driverId}`);

    const snapshot = await driverRef.once("value");
    if (!snapshot.exists()) {
      throw new functions.https.HttpsError(
        "not-found",
        `Driver ${driverId} not found`
      );
    }

    await driverRef.update({
      status: status,
      timestamps: Date.now(),
    });
    return {
      success: true,
      message: `Driver status updated to ${status ? "online" : "offline"}`,
      driverId: driverId,
      newStatus: status,
      updatedAt: Date.now(),
    };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    // Generic error
    throw new functions.https.HttpsError(
      "internal",
      "Failed to update driver status"
    );
  }
});

export const createPaymentIntent = functions.https.onCall(
  async (data, context) => {
    try {
      // Import Stripe only when needed
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeSecretKey);

      const { amount, currency = "usd", customerId } = data;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: currency,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
);

export const createCustomer = functions.https.onCall(async (data, context) => {
  try {
    // Import Stripe only when needed
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeSecretKey);

    const { email, phone, name } = data;

    const customer = await stripe.customers.create({
      email: email,
      phone: phone,
      name: name,
    });

    return {
      customerId: customer.id,
    };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

export const getPaymentMethods = functions.https.onCall(
  async (data, context) => {
    try {
      // Import Stripe only when needed
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeSecretKey);

      const { customerId } = data;

      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      return {
        paymentMethods: paymentMethods.data,
      };
    } catch (error) {
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
);

export const attachPaymentMethod = functions.https.onCall(
  async (data, context) => {
    try {
      // Import Stripe only when needed
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeSecretKey);

      const { paymentMethodId, customerId } = data;

      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      return { success: true };
    } catch (error) {
      throw new functions.https.HttpsError("internal", error.message);
    }
  }
);
