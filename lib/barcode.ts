export function ticketBarcodeValue(
  gameNumber: string,
  packNumber: string,
  ticketNumber: number,
) {
  return `${gameNumber}${packNumber}${String(ticketNumber).padStart(3, "0")}`;
}
