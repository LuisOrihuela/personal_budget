const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const envelopes = [];

router.param("id", (req, res, next, id) => {
  const envelopeIndex = envelopes.findIndex((envelope) => envelope.id === id);
  if (envelopeIndex === -1) {
    res.status(404).send("envelope not found");
  } else {
    req.id = id;
    req.envelopeIndex = envelopeIndex;
    req.envelope = envelopes[envelopeIndex];
    next();
  }
});

// create an envelope
router.post("/", (req, res) => {
  const { title, budget } = req.body;
  if (title && budget) {
    const id = uuidv4();
    envelopes.push({ id, title, budget });
    res.status(201).send("created!");
  } else {
    res.status(400).send("title or budget missing");
  }
});

// get all envelopes
router.get("/", (req, res) => {
  res.status(200).send(envelopes);
});

// get a specific envelope
router.get("/:id", (req, res) => {
  const { envelope, envelopeIndex, id, params } = req;
  res.status(200).send(envelope);
});

router.put("/:id", (req, res) => {
  const { envelope, envelopeIndex, body } = req;
  if (body) {
    const updatedEnvelope = { ...envelope, ...body };
    envelopes[envelopeIndex] = updatedEnvelope;
    res.status(201).send(updatedEnvelope);
  }
});

router.delete("/:id", (req, res) => {
  const { envelopeIndex, envelope } = req;
  envelopes.splice(envelopeIndex, 1);
  res.status(201).send(envelope);
});

router.post("/transfer/:from/:to", (req, res) => {
  const { transferAmount } = req.body ?? {};
  const fromEnvelope = envelopes.find(
    (envelope) => envelope.id === req?.params?.from
  );
  const targetEnvelope = envelopes.find(
    (envelope) => envelope.id === req?.params?.to
  );
  if (!transferAmount || !fromEnvelope || !targetEnvelope) {
    res.status(404).send("something went wrong!");
  } else {
    fromEnvelope.budget -= transferAmount;
    targetEnvelope.budget += transferAmount;
    res.status(200).send(targetEnvelope);
  }
});

module.exports = router;
