const font = [];

font[0x20] = [0x0,0x0,0x0];
font[0x21] = [0x2E];
font[0x22] = [0x6,0x0,0x6];
font[0x23] = [0x0];
font[0x24] = [0x0];
font[0x25] = [0x12,0x8,0x24];
font[0x26] = [0x8,0x1C,0x8];
font[0x27] = [0x2];
font[0x28] = [0x1C,0x22];
font[0x29] = [0x22,0x1C];
font[0x2A] = [0x14,0x8,0x14];
font[0x2B] = [0x8,0x1C,0x8];
font[0x2C] = [0x31];
font[0x2D] = [0x8,0x8,0x8];
font[0x2E] = [0x20];
font[0x2F] = [0x30,0x8,0x6];
font[0x30] = [0x3E,0x22,0x3E];
font[0x31] = [0x3E];
font[0x32] = [0x3A,0x2A,0x2E];
font[0x33] = [0x2A,0x2A,0x3E];
font[0x34] = [0xE,0x8,0x3E];
font[0x35] = [0x2E,0x2A,0x3A];
font[0x36] = [0x3E,0x2A,0x3A];
font[0x37] = [0x2,0x2,0x3E];
font[0x38] = [0x3E,0x2A,0x3E];
font[0x39] = [0x2E,0x2A,0x3E];
font[0x3A] = [0x14];
font[0x3B] = [0x34];
font[0x3C] = [0x8,0x14,0x22];
font[0x3D] = [0x14,0x14,0x14];
font[0x3E] = [0x22,0x14,0x8];
font[0x3F] = [0x2,0x2A,0x6];
font[0x40] = [0x0];


font[0xFF] = [0x2A,0x14,0x2A];  //this is used when the char isn't found

module.exports = font;