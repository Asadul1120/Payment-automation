function validateSerialDifference(currentSerial, nextSerial) {
  const diff = nextSerial - currentSerial;

  console.log(
    `Checking difference: ${nextSerial} - ${currentSerial} = ${diff}`
  );

  if (diff > 5) {
    console.log("Difference বেশি! Process বন্ধ করা হবে.");
    return false;
  }

  return true;
}

module.exports = validateSerialDifference;
