const crypto = require("crypto");
const { getFirestore, withRetry } = require("../config/firebaseAdmin");

const COLLECTION = "assistant_conversations";

const buildConversationId = () => crypto.randomUUID();

const createOrGetConversationRef = async (conversationId) => {
  const db = getFirestore();
  const resolvedConversationId = conversationId || buildConversationId();
  const ref = db.collection(COLLECTION).doc(resolvedConversationId);
  const snapshot = await withRetry(() => ref.get());

  if (!snapshot.exists) {
    await withRetry(() =>
      ref.set({
        conversationId: resolvedConversationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }

  return { ref, conversationId: resolvedConversationId };
};

const appendMessages = async ({ conversationId, userMessage, assistantReply }) => {
  const { ref, conversationId: resolvedConversationId } = await createOrGetConversationRef(
    conversationId
  );

  const now = new Date().toISOString();
  const batch = getFirestore().batch();

  const messagesCollection = ref.collection("messages");
  const userRef = messagesCollection.doc();
  const assistantRef = messagesCollection.doc();

  batch.set(userRef, {
    role: "user",
    content: userMessage,
    createdAt: now,
  });

  batch.set(assistantRef, {
    role: "assistant",
    content: assistantReply,
    createdAt: now,
  });

  batch.update(ref, {
    updatedAt: now,
    lastMessageAt: now,
  });

  await withRetry(() => batch.commit());

  return { conversationId: resolvedConversationId };
};

const getConversationHistory = async (conversationId, maxMessages = 20) => {
  if (!conversationId) {
    return [];
  }

  const db = getFirestore();
  const snapshot = await withRetry(() =>
    db
      .collection(COLLECTION)
      .doc(conversationId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .limit(maxMessages)
      .get()
  );

  return snapshot.docs.map((doc) => ({
    role: doc.data().role,
    content: doc.data().content,
  }));
};

module.exports = {
  appendMessages,
  getConversationHistory,
};
