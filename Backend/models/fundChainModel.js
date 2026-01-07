const db = require("../config/db");
const crypto = require("crypto");

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

// ✅ Normalize object so keys are always in same order
function normalize(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map(normalize);
  }

  const sortedKeys = Object.keys(obj).sort();
  const result = {};
  for (const key of sortedKeys) {
    result[key] = normalize(obj[key]);
  }
  return result;
}

async function getLastBlock() {
  const pool = await db.init();
  const [rows] = await pool.query(
    "SELECT * FROM fund_chain ORDER BY id DESC LIMIT 1"
  );
  return rows[0] || null;
}

async function addBlock(fundData) {
  const pool = await db.init();
  const lastBlock = await getLastBlock();
  const prev_hash = lastBlock ? lastBlock.block_hash : null;
  const timestamp = Date.now();

  // ✅ normalize before hashing & storing
  const normalizedFundData = normalize(fundData);

  const blockContent = JSON.stringify({
    fundData: normalizedFundData,
    prev_hash,
    timestamp,
  });

  const block_hash = sha256(blockContent);
  const signature = sha256(block_hash + process.env.BLOCKCHAIN_SECRET);

  await pool.query(
    `INSERT INTO fund_chain (block_hash, prev_hash, fund_data, signature, timestamp) VALUES (?, ?, ?, ?, ?)`,
    [
      block_hash,
      prev_hash,
      JSON.stringify(normalizedFundData),
      signature,
      timestamp,
    ]
  );

  return { block_hash, prev_hash, signature };
}

async function getChain() {
  const pool = await db.init();
  const [rows] = await pool.query("SELECT * FROM fund_chain ORDER BY id ASC");
  return rows;
}

async function verifyChain() {
  const chain = await getChain();

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const prev_hash = i === 0 ? null : chain[i - 1].block_hash;

    let fundData = block.fund_data;

    // If fundData is a string, parse it
    if (typeof fundData === "string") {
      try {
        fundData = JSON.parse(fundData);
      } catch (e) {
        // If parsing fails, just keep it as is
      }
    }

    // ✅ normalize again here
    const normalizedFundData = normalize(fundData);

    const blockContent = JSON.stringify({
      fundData: normalizedFundData,
      prev_hash,
      timestamp: Number(block.timestamp),
    });

    const expected_hash = sha256(blockContent);
    const expected_signature = sha256(
      expected_hash + process.env.BLOCKCHAIN_SECRET
    );

    if (
      block.block_hash !== expected_hash ||
      block.signature !== expected_signature
    ) {
      return false;
    }
  }

  return true;
}

// Returns detailed information about where the chain breaks
async function verifyChainDetailed() {
  const chain = await getChain();
  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const prev_hash_expected = i === 0 ? null : chain[i - 1].block_hash;

    let fundData = block.fund_data;
    if (typeof fundData === "string") {
      try {
        fundData = JSON.parse(fundData);
      } catch (e) {}
    }

    const normalizedFundData = normalize(fundData);
    const blockContent = JSON.stringify({
      fundData: normalizedFundData,
      prev_hash: prev_hash_expected,
      timestamp: Number(block.timestamp),
    });
    const expected_hash = sha256(blockContent);
    const expected_signature = sha256(
      expected_hash + process.env.BLOCKCHAIN_SECRET
    );

    const broken =
      block.block_hash !== expected_hash ||
      block.signature !== expected_signature;

    if (broken) {
      return {
        valid: false,
        breakIndex: i,
        blockId: block.id || null,
        expected_hash,
        actual_hash: block.block_hash,
        expected_signature,
        actual_signature: block.signature,
        prev_hash_expected,
        prev_hash_actual: block.prev_hash,
      };
    }
  }
  return { valid: true, breakIndex: null };
}

// 👇 Export in a TS-friendly way
exports.addBlock = addBlock;
exports.getChain = getChain;
exports.verifyChain = verifyChain;
exports.getLastBlock = getLastBlock;
exports.verifyChainDetailed = verifyChainDetailed;
