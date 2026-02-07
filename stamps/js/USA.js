// stamps.js — filters, sorting, paging (top & bottom), text Jump-to, and scroll-to-top
// Jamison Stamps & Books

// =========================
// 1) DATA
// =========================
const stamps = [{
        scott: "147",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.47,
        location: "NA01-0023-04-01",
        paypalId: "VLXK5MGURSGMW"
    },
    {
        scott: "147",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.47,
        location: "SL01-0001-01-01",
        paypalId: "ZQHKY8Q7P4XBN"
    },
    {
        scott: "147",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.47,
        location: "SL01-0001-05-02",
        paypalId: "J7XMC8XE5VX32"
    },
    {
        scott: "156",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Poor",
        price: 0.22,
        location: "SD22-0001-04-01",
        paypalId: "HYNDGWRBMN3EN"
    },
    {
        scott: "156",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 1.12,
        location: "SL01-0001-02-06",
        paypalId: "XQZDC8C4L855G"
    },
    {
        scott: "156",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Poor",
        price: 0.22,
        location: "SL01-0001-03-02",
        paypalId: "M8V8RQTMPD3TL"
    },
    {
        scott: "156",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.45,
        location: "SL01-0001-05-05",
        paypalId: "A7U69JHJAS5EA"
    },
    {
        scott: "156",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Poor",
        price: 0.22,
        location: "SL01-0001-06-01",
        paypalId: "Z2SWMKPLH74PC"
    },
    {
        scott: "156",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Poor",
        price: 0.22,
        location: "SL01-0001-04-02",
        paypalId: "AXEF4NBTYBLMY"
    },
    {
        scott: "157",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 5.06,
        location: "LA01-0007-01-02",
        paypalId: "MZ86UJDWJMD3W"
    },
    {
        scott: "158",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.08,
        location: "SD22-0001-04-03",
        paypalId: "7TSTDFCV3PWS6"
    },
    {
        scott: "159",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 5.60,
        location: "LA01-0007-02-01",
        paypalId: "EWFW5Y4ERLBK4"
    },
    {
        scott: "178",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 4.13,
        location: "SL01-0001-06-02",
        paypalId: "3CNALF8U779KN"
    },
    {
        scott: "178",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 4.13,
        location: "SL01-0001-06-05",
        paypalId: "3PC923KPHTLAL"
    },
    {
        scott: "178",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 4.13,
        location: "SL01-0001-07-01",
        paypalId: "RX8Z2SZUDJFZE"
    },
    {
        scott: "178",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 4.13,
        location: "SL01-0001-07-02",
        paypalId: "ZPK46G5Z9SQ5G"
    },
    {
        scott: "178",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 2.95,
        location: "SL01-0001-07-04",
        paypalId: "39ZTAW8J72X8U"
    },
    {
        scott: "182",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.76,
        location: "NA01-0029-01-01",
        paypalId: "CLCQRH7JJ8GZU"
    },
    {
        scott: "183",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 2.66,
        location: "NA01-0029-01-02",
        paypalId: "JNZ7XC8HWERZ6"
    },
    {
        scott: "183",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.62,
        location: "LA01-0008-01-02",
        paypalId: "GUHNK6SLC3H7U"
    },
    {
        scott: "221",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 3.62,
        location: "SD22-0001-06-04",
        paypalId: "CUSDSZWYC2KFW"
    },
    {
        scott: "222",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 1.26,
        location: "LA01-0009-02-02",
        paypalId: "2KLV2P3SCWNVS"
    },
    {
        scott: "225",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 3.51,
        location: "LA01-0009-03-03",
        paypalId: "426SXECXGAJPA"
    },
    {
        scott: "226",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.40,
        location: "NA01-0033-04-04",
        paypalId: "YV3P9GA2N3Y9L"
    },
    {
        scott: "227",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 3.26,
        location: "NA01-0033-05-01",
        paypalId: "86CCH8CYVP4CC"
    },
    {
        scott: "234",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.72,
        location: "LA01-0010-02-01",
        paypalId: "KRMYJ48S2C4WC"
    },
    {
        scott: "236",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 4.28,
        location: "LA01-0010-02-03",
        paypalId: "X9L6WRZBJCR9G"
    },
    {
        scott: "247",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.44,
        location: "LA01-0011-01-02",
        paypalId: "KNU9WRTTMZK5J"
    },
    {
        scott: "248",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 5.86,
        location: "LA01-0011-01-03",
        paypalId: "U4FYVEB9RH9XL"
    },
    {
        scott: "252",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 5.28,
        location: "LA01-0011-02-03",
        paypalId: "6GB387M69YWQ4"
    },
    {
        scott: "252",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 2.64,
        location: "NA01-0037-02-05",
        paypalId: "AGBLFPMSZ3AMN"
    },
    {
        scott: "279",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.05,
        location: "LA01-0012-04-01",
        paypalId: "H4WC73KDUULW4"
    },
    {
        scott: "279B",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.10,
        location: "NA01-0039-04-02",
        paypalId: "CBRMPSWK939Z2"
    },
    {
        scott: "285",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 3.48,
        location: "NA01-0041-01-01",
        paypalId: "MURXXGR4MAGSN"
    },
    {
        scott: "285",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Poor",
        price: 0.27,
        location: "LA01-0013-01-01",
        paypalId: "8BHVQ48EP437C"
    },
    {
        scott: "288",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Damaged",
        price: 0.18,
        location: "LA01-0013-02-01",
        paypalId: "UGRSJFXGEL3DJ"
    },
    {
        scott: "306",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 1.95,
        location: "LA01-0014-02-04",
        paypalId: "VSH3C96XQWEXC"
    },
    {
        scott: "329",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 13.10,
        location: "LA01-0015-04-02",
        paypalId: "WPKDR3L4CRGW6"
    },
    {
        scott: "335",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.46,
        location: "LA01-0016-01-05",
        paypalId: "2H9LQ2A2R8838"
    },
    {
        scott: "338",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.34,
        location: "NA01-0049-02-05",
        paypalId: "UJ2TYYWTDF8TU"
    },
    {
        scott: "372",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.50,
        location: "LA01-0017-03-03",
        paypalId: "YAHQTJHDCXMPL"
    },
    {
        scott: "372",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 1.68,
        location: "SD22-0002-06-01",
        paypalId: "Y5JRYQ8HFZFR8"
    },
    {
        scott: "381",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 1.59,
        location: "LA01-0017-05-05",
        paypalId: "BXL9XYXCNT7XU"
    },
    {
        scott: "397",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.52,
        location: "NA01-0061-01-01",
        paypalId: "ZXWM6E8CDWGXW"
    },
    {
        scott: "397",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.75,
        location: "LA01-0018-03-01",
        paypalId: "93RA4NP2PS9WE"
    },
    {
        scott: "405",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0019-01-01",
        paypalId: "DN6XHBNXN5Z7U"
    },
    {
        scott: "405",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 1.28,
        location: "NA01-0063-01-01",
        paypalId: "KHGXG7SN9MQM4"
    },
    {
        scott: "405",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "SL01-0001-05-04",
        paypalId: "N3QLMFPZYRWFN"
    },
    {
        scott: "418",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Poor",
        price: 0.17,
        location: "LA01-0019-04-01",
        paypalId: "K5CDZT44BWF7S"
    },
    {
        scott: "425",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Partial Gum",
        grade: "Fair/Good",
        price: 0.26,
        location: "LA01-0020-01-02",
        paypalId: "4X7XAD9P9JVLA"
    },
    {
        scott: "463",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 1.72,
        location: "LA01-0022-01-02",
        paypalId: "SRE5KRW66FPKA"
    },
    {
        scott: "486",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine/Very Fine",
        price: 1.78,
        location: "NA01-0079-01-01",
        paypalId: "QANRAUX3E4Z6E"
    },
    {
        scott: "486",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.30,
        location: "LA01-0023-01-01",
        paypalId: "AM8URS4YRZ9Z4"
    },
    {
        scott: "492",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.18,
        location: "LA01-0023-02-03",
        paypalId: "Z3JQ6NGD9HP4N"
    },
    {
        scott: "493",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 8.10,
        location: "LA01-0023-02-04",
        paypalId: "N8747SZ7QJLE2"
    },
    {
        scott: "504",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.16,
        location: "LA01-0024-02-02",
        paypalId: "GQKD7JYKG6LUN"
    },
    {
        scott: "504",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.04,
        location: "NA01-0081-02-02",
        paypalId: "E7ENR4A3ATHFL"
    },
    {
        scott: "504",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.04,
        location: "SL01-0001-01-05",
        paypalId: "D8S4NYSA97GUL"
    },
    {
        scott: "504",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.04,
        location: "SL01-0001-01-06",
        paypalId: "BKAV7W4JLR73C"
    },
    {
        scott: "504",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.16,
        location: "SL01-0001-02-01",
        paypalId: "TZYPLNG24GKUE"
    },
    {
        scott: "504",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.06,
        location: "SL01-0001-02-03",
        paypalId: "8L5338WFDKCP6"
    },
    {
        scott: "504",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.09,
        location: "SL01-0001-10-03",
        paypalId: "H467DZYZAB7BY"
    },
    {
        scott: "517",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.14,
        location: "LA01-0022-04-02",
        paypalId: "NSP348UNRGGCG"
    },
    {
        scott: "517",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.19,
        location: "NA01-0081-05-02",
        paypalId: "5D2L3WUTE832L"
    },
    {
        scott: "542",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.10,
        location: "LA01-0026-02-01",
        paypalId: "6GP4ALQSWY8RA"
    },
    {
        scott: "551",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.09,
        location: "LA01-0027-01-01",
        paypalId: "MVASS23UVLXV2"
    },
    {
        scott: "551",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 0.04,
        location: "NA01-0091-01-01",
        paypalId: "PW59FK85C9GK2"
    },
    {
        scott: "552",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fair/Good",
        price: 0.15,
        location: "NA01-0091-01-02",
        paypalId: "T6DR3B5277ZNN"
    },
    {
        scott: "553",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "NA01-0091-01-03",
        paypalId: "SLSFHLZKR6HZY"
    },
    {
        scott: "554",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.58,
        location: "LA01-0027-01-04",
        paypalId: "7CVXCYUYAGUSE"
    },
    {
        scott: "554",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "NA01-0091-01-04",
        paypalId: "46S5NTDFDH5PQ"
    },
    {
        scott: "555",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.40,
        location: "NA01-0091-02-01",
        paypalId: "TKGR7LACJ2FVL"
    },
    {
        scott: "558",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.10,
        location: "LA01-0027-02-03",
        paypalId: "AWXQLU5W49WYG"
    },
    {
        scott: "559",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.08,
        location: "LA01-0027-02-04",
        paypalId: "K67KJSJ57H98E"
    },
    {
        scott: "562",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.19,
        location: "NA01-0091-03-03",
        paypalId: "64WKFWZT88XVW"
    },
    {
        scott: "571",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.08,
        location: "NA01-0091-06-02",
        paypalId: "GQM8CVEKQDY2U"
    },
    {
        scott: "571",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.28,
        location: "SL01-0001-06-06",
        paypalId: "QV9S3EH56GKA8"
    },
    {
        scott: "582",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fair",
        price: 0.47,
        location: "NA01-0093-02-02",
        paypalId: "3233CMRET55RN"
    },
    {
        scott: "582",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.07,
        location: "SL01-0001-01-02",
        paypalId: "93QKSHR5A7XFQ"
    },
    {
        scott: "583",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 0.58,
        location: "LA01-0028-01-03",
        paypalId: "HBT8YTK66E6FU"
    },
    {
        scott: "583",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.10,
        location: "NA01-0093-02-03",
        paypalId: "44PNU74ATHQMJ"
    },
    {
        scott: "586",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.08,
        location: "LA01-0028-01-06",
        paypalId: "4CBB2P4BT7DBQ"
    },
    {
        scott: "599",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.09,
        location: "LA01-0028-03-03",
        paypalId: "E2FRDDZSX7C94"
    },
    {
        scott: "604",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.40,
        location: "NA01-0099-05-02",
        paypalId: "VD22PXU6CFS4N"
    },
    {
        scott: "605",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0028-04-03",
        paypalId: "DG4Z86MPPKYTE"
    },
    {
        scott: "606",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good/Very Good",
        price: 0.20,
        location: "NA01-0099-05-03",
        paypalId: "DURVACV3MFFBQ"
    },
    {
        scott: "610",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good/Very Good",
        price: 0.14,
        location: "LA01-0028-05-01",
        paypalId: "4B9FCWCHMN34E"
    },
    {
        scott: "610",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 0.10,
        location: "NA01-0089-03-01",
        paypalId: "AKRJRDB4UL4Q6"
    },
    {
        scott: "610",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Good/Very Good",
        price: 0.17,
        location: "SL01-0001-07-06",
        paypalId: "TB7RWB5KUTYRN"
    },
    {
        scott: "610",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.20,
        location: "SL01-0001-09-05",
        paypalId: "MJMC8U9MTMUGQ"
    },
    {
        scott: "610",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "SL01-0001-09-06",
        paypalId: "GCK7WENMKTNCS"
    },
    {
        scott: "611",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 2.06,
        location: "LA01-0028-05-02",
        paypalId: "GHSW3V8MQ8W4Y"
    },
    {
        scott: "611",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good/Very Good",
        price: 2.52,
        location: "SL01-0001-10-01",
        paypalId: "UPHJJZJRHUV36"
    },
    {
        scott: "612",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 7.25,
        location: "LA01-0028-05-03",
        paypalId: "CSUHBNXSZ2DM4"
    },
    {
        scott: "614",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 0.46,
        location: "LA01-0029-01-01",
        paypalId: "X5W7Q8TZRQD74"
    },
    {
        scott: "619",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 11.96,
        location: "LA01-0029-02-03",
        paypalId: "5EMXDLNP4W5UN"
    },
    {
        scott: "619",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 5.80,
        location: "NA014-0101-01-03",
        paypalId: "QXCXJREVKR3BN"
    },
    {
        scott: "631",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fine/Very Fine",
        price: 1.23,
        location: "LA01-0031-02-04",
        paypalId: "ESR5A85TNFXD2"
    },
    {
        scott: "633",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good/Very Good",
        price: 0.44,
        location: "NA01-0105-02-03",
        paypalId: "FEN9USDNMZQEU"
    },
    {
        scott: "634",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0031-02-05",
        paypalId: "PRXBCQYYZXH6L"
    },
    {
        scott: "639",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 0.36,
        location: "LA01-0031-04-01",
        paypalId: "HGKLVQQ9NCK6G"
    },
    {
        scott: "684",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0115-01-01",
        paypalId: "6B3MQWBHCVDDC"
    },
    {
        scott: "685",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "LA01-0033-03-05",
        paypalId: "SKTZ27ZZF65RL"
    },
    {
        scott: "701",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0034-02-05",
        paypalId: "4T3EGFTX9Y4ZQ"
    },
    {
        scott: "704",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.14,
        location: "SL01-0001-10-05",
        paypalId: "X22M99R6MK3ZN"
    },
    {
        scott: "705",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0034-03-02",
        paypalId: "29TK7H2DX7J2A"
    },
    {
        scott: "705",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "SL01-0001-03-01",
        paypalId: "QAUDKLAYXR67N"
    },
    {
        scott: "706",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 0.08,
        location: "LA01-0034-03-03",
        paypalId: "MA8R4F8M4FW8G"
    },
    {
        scott: "706",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "NA01-0117-01-03",
        paypalId: "8BAG3SAWCRAB6"
    },
    {
        scott: "707",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.19,
        location: "NA01-0117-01-04",
        paypalId: "XNCJTNA28EUPQ"
    },
    {
        scott: "712",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.40,
        location: "SD22-0003-05-02",
        paypalId: "N9JKMKNZD4VWN"
    },
    {
        scott: "713",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good/Very Good",
        price: 0.65,
        location: "LA01-0034-05-01",
        paypalId: "WFPKQJLAZQJL4"
    },
    {
        scott: "715",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 3.74,
        location: "LA01-0034-05-03",
        paypalId: "UZM2A3GUC8GXU"
    },
    {
        scott: "716",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fine/Very Fine",
        price: 0.26,
        location: "LA01-0035-01-01",
        paypalId: "Y2RG8732GZ58E"
    },
    {
        scott: "727",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0035-04-02",
        paypalId: "BTN53H5M6AHTC"
    },
    {
        scott: "728",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0036-02-01",
        paypalId: "8WB73Z24A2J9U"
    },
    {
        scott: "733",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.20,
        location: "LA01-0038-03-01",
        paypalId: "U8UBBAP4URAPQ"
    },
    {
        scott: "740",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0039-01-01",
        paypalId: "R9FLW4UZ2QR2S"
    },
    {
        scott: "743",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.04,
        location: "LA01-0039-02-03",
        paypalId: "MKAL7R297H9AE"
    },
    {
        scott: "744",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.07,
        location: "LA01-0039-01-02",
        paypalId: "G67PE93ZRLV5G"
    },
    {
        scott: "747",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.48,
        location: "LA01-0039-01-03",
        paypalId: "6JZZ3GB7729LN"
    },
    {
        scott: "803",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0049-01-01",
        paypalId: "CXVB663FEP8TE"
    },
    {
        scott: "807",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "LA01-0049-01-05",
        paypalId: "X5YCG6Z7XVMU4"
    },
    {
        scott: "842",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0050-03-04",
        paypalId: "B99YTGDS8AY7N"
    },
    {
        scott: "845",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.45,
        location: "LA01-0050-04-03",
        paypalId: "RLTLFHBA9ATKE"
    },
    {
        scott: "848",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.04,
        location: "LA01-0050-05-01",
        paypalId: "RVMXSYZM5G2RQ"
    },
    {
        scott: "854",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0051-03-03",
        paypalId: "9K8KYV2ZGJH5U"
    },
    {
        scott: "867",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.09,
        location: "LA01-0052-02-04",
        paypalId: "YR76F36PKUFWE"
    },
    {
        scott: "868",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.20,
        location: "LA01-0052-02-05",
        paypalId: "J8E8MJUCKTAT2"
    },
    {
        scott: "881",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine/Very Fine",
        price: 0.17,
        location: "LA01-0053-01-03",
        paypalId: "RT7BTH4TRGDQ2"
    },
    {
        scott: "881",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "NA01-0157-01-03",
        paypalId: "HZ8KEUQNJUCAA"
    },
    {
        scott: "882",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.20,
        location: "LA01-0053-01-04",
        paypalId: "JMN78LJ5VR2US"
    },
    {
        scott: "884",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0053-02-01",
        paypalId: "66R4AHVWPPW84"
    },
    {
        scott: "888",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.70,
        location: "LA01-0053-02-05",
        paypalId: "DGMEK7VL7WPN6"
    },
    {
        scott: "889",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0053-03-01",
        paypalId: "K2ZL8V7QG658E"
    },
    {
        scott: "906",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.52,
        location: "LA01-0054-03-03",
        paypalId: "UQKFT52PFA89C"
    },
    {
        scott: "921",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0055-05-03",
        paypalId: "WSPXYJEXRTASQ"
    },
    {
        scott: "929",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0057-01-02",
        paypalId: "RT839FMQ2PSPJ"
    },
    {
        scott: "940",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.90,
        location: "SL01-0002-03-01",
        paypalId: "9NPW2NLBHZVAL"
    },
    {
        scott: "942",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.90,
        location: "SL01-0002-07-01",
        paypalId: "F75BXWAZWVDSC"
    },
    {
        scott: "942",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0057-04-02",
        paypalId: "5X6WKU87U6SNE"
    },
    {
        scott: "945",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0058-01-02",
        paypalId: "YTY6F6W9CLZFY"
    },
    {
        scott: "946",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0058-01-03",
        paypalId: "HWMMJNUJ3DKP8"
    },
    {
        scott: "948",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.75,
        location: "LA01-0058-02-02",
        paypalId: "X5P3RHZ3CRDCQ"
    },
    {
        scott: "953",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0059-02-02",
        paypalId: "LQSKEDXYM3QXY"
    },
    {
        scott: "954",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0059-01-03",
        paypalId: "9MCSJ9WX6XGBE"
    },
    {
        scott: "956",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0059-02-04",
        paypalId: "3Z7VG52JLRZ54"
    },
    {
        scott: "958",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0059-03-02",
        paypalId: "SY5DSGUNRYS72"
    },
    {
        scott: "962",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0059-04-02",
        paypalId: "MABW6JQ3R679C"
    },
    {
        scott: "963",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0059-04-03",
        paypalId: "H4Y9W3XUBFAWL"
    },
    {
        scott: "966",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0060-01-03",
        paypalId: "VKPYXVBXES3GU"
    },
    {
        scott: "969",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0061-01-02",
        paypalId: "3YXJQ44TKP8Y6"
    },
    {
        scott: "978",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0061-02-02",
        paypalId: "APJ9B2V8PJLNL"
    },
    {
        scott: "979",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0061-01-03",
        paypalId: "CRF649EKK6ZLY"
    },
    {
        scott: "982",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0061-03-02",
        paypalId: "S7JZW5L52ZENS"
    },
    {
        scott: "984",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0061-04-01",
        paypalId: "A8CZFKD8N4YN4"
    },
    {
        scott: "1008",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.13,
        location: "LA01-0063-04-02",
        paypalId: "TLT827QUMK6KJ"
    },
    {
        scott: "1012",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0064-01-03",
        paypalId: "HJBVC95R66PTL"
    },
    {
        scott: "1013",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0064-02-01",
        paypalId: "3AYYTTKV7ZU2N"
    },
    {
        scott: "1014",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0064-02-02",
        paypalId: "BRDX2Y8ULXU88"
    },
    {
        scott: "1015",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0064-03-01",
        paypalId: "RWRGA7K9HR6GW"
    },
    {
        scott: "1016",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0064-03-02",
        paypalId: "EVBK5XTTTD2DE"
    },
    {
        scott: "1017",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.10,
        location: "LA01-0064-04-01",
        paypalId: "RPKDYK7B8TLB8"
    },
    {
        scott: "1018",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.10,
        location: "NA01-0185-01-02",
        paypalId: "H7MS5ZJ94UFNL"
    },
    {
        scott: "1018",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0064-04-02",
        paypalId: "J7V3EDWD5HPWC"
    },
    {
        scott: "1020",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0065-01-01",
        paypalId: "URNRTDGWR9Y4S"
    },
    {
        scott: "1021",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.10,
        location: "NA01-0185-02-02",
        paypalId: "GKD2N8M5RE3CS"
    },
    {
        scott: "1021",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0065-01-02",
        paypalId: "7XTAY95VVQJ6L"
    },
    {
        scott: "1022",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "LA01-0065-01-03",
        paypalId: "M8V9KNBPQTP9Q"
    },
    {
        scott: "1023",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0065-02-01",
        paypalId: "KK7E3NMQ3BFGS"
    },
    {
        scott: "1024",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0065-02-02",
        paypalId: "M8W4LZEVPSCJQ"
    },
    {
        scott: "1024",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.13,
        location: "NA01-0185-03-02",
        paypalId: "TW5YFZZCDJYW4"
    },
    {
        scott: "1025",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.10,
        location: "LA01-0065-03-01",
        paypalId: "YW6T4YCXCEUQU"
    },
    {
        scott: "1026",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "LA01-0065-03-02",
        paypalId: "77BK2XQ68Z252"
    },
    {
        scott: "1027",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.13,
        location: "LA01-0065-04-01",
        paypalId: "CB2ZK7P8FGPTW"
    },
    {
        scott: "1029",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0065-04-03",
        paypalId: "F8Z695J8422W2"
    },
    {
        scott: "1029",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.13,
        location: "NA01-0185-05-01",
        paypalId: "KPFRHUGJKFJUU"
    },
    {
        scott: "1030",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "NA01-0187-01-01",
        paypalId: "HPF2RYSWBJS6W"
    },
    {
        scott: "1031",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0187-01-02",
        paypalId: "49SNMMMMDXZJG"
    },
    {
        scott: "1049",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.21,
        location: "LA01-0067-02-03",
        paypalId: "FWUGTN5QNXABN"
    },
    {
        scott: "1049",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.16,
        location: "NA01-0187-04-01",
        paypalId: "HTNMB4UQ3YSVG"
    },
    {
        scott: "1050",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.12,
        location: "LA01-0067-02-04",
        paypalId: "QBJ6A58GYRUBW"
    },
    {
        scott: "1052",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0067-03-02",
        paypalId: "F6MJAVTJXPJ8Y"
    },
    {
        scott: "1054",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.02,
        location: "LA01-0067-04-01",
        paypalId: "XJ2UFH5CTVATN"
    },
    {
        scott: "1054",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.02,
        location: "NA01-0191-01-01",
        paypalId: "DXRGGVLXZQY5G"
    },
    {
        scott: "1057",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0067-04-04",
        paypalId: "SHE28V7PFALHL"
    },
    {
        scott: "1057",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "NA01-0191-01-04",
        paypalId: "CE9UDVGN5JLEE"
    },
    {
        scott: "1058",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.02,
        location: "LA01-0067-05-01",
        paypalId: "TT8LYA7MALGKY"
    },
    {
        scott: "1061",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0068-01-02",
        paypalId: "772GLSNPNNYQ6"
    },
    {
        scott: "1066",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "LA01-0068-03-02",
        paypalId: "QKJDJFAYP84Y8"
    },
    {
        scott: "1066",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Fine",
        price: 0.15,
        location: "NA01-0195-03-02",
        paypalId: "V6ACWZU6YY28Q"
    },
    {
        scott: "1067",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0068-03-03",
        paypalId: "XSYGYKE3TU6BS"
    },
    {
        scott: "1067",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.13,
        location: "NA01-0195-03-03",
        paypalId: "BPQ8GMB8P7TP4"
    },
    {
        scott: "1068",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0068-02-03",
        paypalId: "NEPWTWRGSPZJ4"
    },
    {
        scott: "1069",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Very Good/Fine",
        price: 0.13,
        location: "LA01-0068-04-01",
        paypalId: "BD5XCHE55DNWG"
    },
    {
        scott: "1069",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0195-04-01",
        paypalId: "BD5XCHE55DNWG"
    },
    {
        scott: "1070",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0068-04-02",
        paypalId: "BSB86CSLZFYL2"
    },
    {
        scott: "1071",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fair/Good",
        price: 0.03,
        location: "LA01-0068-04-03",
        paypalId: "RE67JPAJ2EA24"
    },
    {
        scott: "1071",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0195-04-03",
        paypalId: "622C3E7LVRCHS"
    },
    {
        scott: "1073",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.13,
        location: "LA01-0069-01-02",
        paypalId: "KJZLUKQSHJR4G"
    },
    {
        scott: "1073",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "NA01-0197-01-02",
        paypalId: "5Q3LWEMPZKNLS"
    },
    {
        scott: "1076",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Fine/Extra Fine",
        price: 0.17,
        location: "LA01-0069-01-03",
        paypalId: "KFKNPFW9T36CQ"
    },
    {
        scott: "1076",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0197-01-03",
        paypalId: "82TVZM52T82BY"
    },
    {
        scott: "1077",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "LA01-0070-01-01",
        paypalId: "TKCXWRTLS2MU2"
    },
    {
        scott: "1079",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Fine/Very Fine",
        price: 0.17,
        location: "LA01-0070-01-03",
        paypalId: "2KDNF8X2A3ZDG"
    },
    {
        scott: "1082",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Gooid/Very Good",
        price: 0.07,
        location: "LA01-0070-03-02",
        paypalId: "QAYA4W3BGFNZW"
    },
    {
        scott: "1084",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine/Very Fine",
        price: 0.17,
        location: "LA01-0070-03-03",
        paypalId: "YM88ZNDUN5GNE"
    },
    {
        scott: "1085",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0070-02-03",
        paypalId: "VYN9XKVJA877E"
    },
    {
        scott: "1086",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0070-04-01",
        paypalId: "3N8AW9U67CQZA"
    },
    {
        scott: "1087",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Fine",
        price: 0.20,
        location: "LA01-0070-03-04",
        paypalId: "UC6D9NF6SKNGJ"
    },
    {
        scott: "1087",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "NA01-0199-01-02",
        paypalId: "MEYKMLLVNU2WL"
    },
    {
        scott: "1088",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Fine",
        price: 0.15,
        location: "LA01-0070-04-02",
        paypalId: "UYYA7FQQDZ8QE"
    },
    {
        scott: "1089",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0070-04-03",
        paypalId: "MWTVZP5YR9TR6"
    },
    {
        scott: "1089",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.13,
        location: "NA01-0199-02-01",
        paypalId: "6827GSVSCCLSG"
    },
    {
        scott: "1090",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.13,
        location: "LA01-0071-02-01",
        paypalId: "5JAM2LL3D6EEN"
    },
    {
        scott: "1091",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0071-01-01",
        paypalId: "ZDWZVCDK4KXG2"
    },
    {
        scott: "1092",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.13,
        location: "LA01-0071-01-02",
        paypalId: "WR5Q6Q5NUEK6J"
    },
    {
        scott: "1093",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0071-01-03",
        paypalId: "2VFLRRJR6CKJG"
    },
    {
        scott: "1094",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0071-04-01",
        paypalId: "JFRVEATQLV6RC"
    },
    {
        scott: "1095",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0071-03-01",
        paypalId: "E6Z4U3ASTVJLU"
    },
    {
        scott: "1095",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "NA01-0199-03-02",
        paypalId: "S6389U7SVSV6S"
    },
    {
        scott: "1096",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "LA01-0071-03-02",
        paypalId: "GXAL82TG4XCWL"
    },
    {
        scott: "1096",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "NA01-0205-01-03",
        paypalId: "GVDMSP7FAXWKE"
    },
    {
        scott: "1097",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.13,
        location: "LA01-0071-02-02",
        paypalId: "RFNYWVQNT6W9J"
    },
    {
        scott: "1098",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0071-02-03",
        paypalId: "CZ2SV4FWL8MX2"
    },
    {
        scott: "1098",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0199-04-02",
        paypalId: "5HPA67QPVWFVN"
    },
    {
        scott: "1099",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.02,
        location: "LA01-0071-02-04",
        paypalId: "24M5T6XQP8QRC"
    },
    {
        scott: "1100",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "LA01-0072-01-02",
        paypalId: "BBDS5S9VYK7F2"
    },
    {
        scott: "1100",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "NA01-0201-02-02",
        paypalId: "W2ADGMQXPQMME"
    },
    {
        scott: "1100",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "SL01-0001-01-03",
        paypalId: "5MCK8T5XH3ABU"
    },
    {
        scott: "1104",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0071-04-02",
        paypalId: "A32KRE2QNGXFU"
    },
    {
        scott: "1104",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "NA01-0201-01-01",
        paypalId: "3ADN9ZD8CUAAA"
    },
    {
        scott: "1105",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0071-03-03",
        paypalId: "ARL947EHW5GVA"
    },
    {
        scott: "1106",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0071-04-03",
        paypalId: "XLH4F7C4LSS68"
    },
    {
        scott: "1107",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0072-01-01",
        paypalId: "U75RVGQEES6JS"
    },
    {
        scott: "1108",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0072-01-04",
        paypalId: "ZANBE2Q5DEUP2"
    },
    {
        scott: "1109",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0072-01-03",
        paypalId: "EU9DBAHHUW3QN"
    },
    {
        scott: "1109",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "NA01-0201-02-03",
        paypalId: "LWMWCLNGCDSKY"
    },
    {
        scott: "1110",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0072-02-01",
        paypalId: "2FG5SQ7A5GCYY"
    },
    {
        scott: "1111",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0072-02-02",
        paypalId: "UXJ4HFMTXCQUQ"
    },
    {
        scott: "1112",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0073-01-01",
        paypalId: "6229XFM9SFD4A"
    },
    {
        scott: "1112",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "NA01-0201-03-01",
        paypalId: "JNCNJWW6P67AU"
    },
    {
        scott: "1116",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0072-04-02",
        paypalId: "LW6PBPTPMB92G"
    },
    {
        scott: "1118",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "LA01-0072-02-04",
        paypalId: "TZSVAZ5MMSHC2"
    },
    {
        scott: "1118",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0205-01-05",
        paypalId: "PH2YWSDJD7R2G"
    },
    {
        scott: "1126",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Good/Very Good",
        price: 0.07,
        location: "LA01-0073-03-03",
        paypalId: "GVNNUA36DLSUJ"
    },
    {
        scott: "1127",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0074-02-01",
        paypalId: "X2TSNX99B8GR2"
    },
    {
        scott: "1128",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0073-03-01",
        paypalId: "E7J85ZLD62S8N"
    },
    {
        scott: "1128",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "NA01-0203-02-01",
        paypalId: "ZK3NP98JDR6BJ"
    },
    {
        scott: "1131",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "LA01-0073-04-02",
        paypalId: "CRR2US9CJBA8J"
    },
    {
        scott: "1131",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "NA01-0203-03-01",
        paypalId: "P9ZRY2ZDHE5JW"
    },
    {
        scott: "1133",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0074-01-01",
        paypalId: "6WP9VAPCTPA2N"
    },
    {
        scott: "1133",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0203-04-01",
        paypalId: "KK5RY7QJ7URHS"
    },
    {
        scott: "1138",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0074-02-04",
        paypalId: "KF2SRSEL3UC5A"
    },
    {
        scott: "1142",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0074-04-01",
        paypalId: "ZAQK5HSJHYWAC"
    },
    {
        scott: "1144",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.02,
        location: "LA01-0074-04-03",
        paypalId: "ZACJPXBJGB4H2"
    },
    {
        scott: "1146",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0075-02-01",
        paypalId: "WF56ATSDVKNMU"
    },
    {
        scott: "1147",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "NA01-0205-03-01",
        paypalId: "RD4ZKNEEB622A"
    },
    {
        scott: "1147",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "SL01-0001-03-03",
        paypalId: "NLWD6G49LMW7W"
    },
    {
        scott: "1149",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0075-01-03",
        paypalId: "7XNQX77VD7NFW"
    },
    {
        scott: "1150",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0075-04-01",
        paypalId: "4CQDCBAYBQV6U"
    },
    {
        scott: "1151",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0075-01-02",
        paypalId: "9AS9LR2ESHN4U"
    },
    {
        scott: "1153",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine/Very Fine",
        price: 0.13,
        location: "LA01-0075-02-02",
        paypalId: "DELZ36QELU5F2"
    },
    {
        scott: "1154",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0075-04-03",
        paypalId: "3TUQW7Z449CHL"
    },
    {
        scott: "1154",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "NA01-0207-05-01",
        paypalId: "U4M9WBKKT2SAU"
    },
    {
        scott: "1157",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0076-02-01",
        paypalId: "VJKVUUSXWE4UA"
    },
    {
        scott: "1158",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0076-02-02",
        paypalId: "TXBSNLJJZAY3W"
    },
    {
        scott: "1161",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.11,
        location: "LA01-0076-01-02",
        paypalId: "L4BVEZAM4HXPW"
    },
    {
        scott: "1163",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0076-02-03",
        paypalId: "Q7FZYHBW29QEN"
    },
    {
        scott: "1164",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "LA01-0076-01-03",
        paypalId: "S3D5R53M2GX3S"
    },
    {
        scott: "1167",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "LA01-0076-02-04",
        paypalId: "LLHW3A2AE4FA2"
    },
    {
        scott: "1168",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "LA01-0076-04-02",
        paypalId: "Z8HVGGQXLWEPL"
    },
    {
        scott: "1171",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.02,
        location: "LA01-0076-04-04",
        paypalId: "26AHXYXR7FRKN"
    },
    {
        scott: "1173",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Good/Very Good",
        price: 0.07,
        location: "LA01-0077-01-02",
        paypalId: "A995MVG5SX8JG"
    },
    {
        scott: "1174",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "LA01-0077-02-01",
        paypalId: "7FMDTPTV24HAA"
    },
    {
        scott: "1174",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fair",
        price: 0.02,
        location: "NA01-0205-05-01",
        paypalId: "P9A24KSQ27X6S"
    },
    {
        scott: "1176",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.08,
        location: "LA01-0077-03-01",
        paypalId: "9L2YLYCB633P6"
    },
    {
        scott: "1181",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0081-03-03",
        paypalId: "CWN7MJP6ZZQCU"
    },
    {
        scott: "1187",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good",
        price: 0.04,
        location: "LA01-0078-01-01",
        paypalId: "AWKRV4ELESDTG"
    },
    {
        scott: "1192",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0078-03-01",
        paypalId: "U2JPQCGQMCSUQ"
    },
    {
        scott: "1196",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0078-03-03",
        paypalId: "7AF3JKD9D9T9A"
    },
    {
        scott: "1197",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fair/Good",
        price: 0.02,
        location: "LA01-0079-01-02",
        paypalId: "WMSQQ34PF4KN8"
    },
    {
        scott: "1201",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0079-02-03",
        paypalId: "7RUC42Q3EU3NG"
    },
    {
        scott: "1201",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "NA01-0215-02-02",
        paypalId: "Y3K4FM86AHYZW"
    },
    {
        scott: "1202",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.10,
        location: "LA01-0079-03-02",
        paypalId: "4DYW3CUW87CFL"
    },
    {
        scott: "C7",
        condition: "Mint",
        hinged: "Hinged",
        gum: "Original Gum",
        grade: "Very Good",
        price: 0.58,
        location: "LA01-0516-03-01",
        paypalId: "L423EQBM26QA4"
    },
    {
        scott: "C25",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.04,
        location: "LA01-0517-04-01",
        paypalId: "UE2EE4UFE9HDQ"
    },
    {
        scott: "C54",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.09,
        location: "LA01-0519-02-01",
        paypalId: "8S4FXB7JKHE3N"
    },
    {
        scott: "C54",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "Original Gum",
        grade: "Fine",
        price: 0.15,
        location: "NA01-C015-01-01",
        paypalId: "J2PPSH55MR8EA"
    },
    {
        scott: "C65",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.05,
        location: "LA01-0519-05-05",
        paypalId: "F32F8UNEB8UFG"
    },
    {
        scott: "C90",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.05,
        location: "NA01-C023-02-02",
        paypalId: "DXGFC7FYGUKDQ"
    },
    {
        scott: "C97",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good",
        price: 0.06,
        location: "SL01-0001-03-05",
        paypalId: "PBH8UWREJRDU2"
    },
    {
        scott: "C97",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.11,
        location: "SL01-0001-04-03",
        paypalId: "UVRT8SMZM6JQQ"
    },
    {
        scott: "C115",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Very Fine",
        price: 0.09,
        location: "NA01-C027-02-01",
        paypalId: "VB6GU9SMF5HZU"
    },
    {
        scott: "C115",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 0.04,
        location: "SL01-0001-04-04",
        paypalId: "M4VMAJB539LTS"
    },
    {
        scott: "C115",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Very Good/Fine",
        price: 0.07,
        location: "SL01-0001-05-01",
        paypalId: "RW9FSSALGFE5L"
    },
    {
        scott: "C116",
        condition: "Used",
        hinged: "Never Hinged",
        gum: "No Gum",
        grade: "Fine",
        price: 0.18,
        location: "NA01-C027-02-02",
        paypalId: "KH9W2D7RMSVWU"
    },
    {
        scott: "E3",
        condition: "Used",
        hinged: "Hinged",
        gum: "No Gum",
        grade: "Good/Very Good",
        price: 8.00,
        location: "NA01-E001-01-03",
        paypalId: "TD32TCUVX3M9N"
    },
    {
        scott: "RE191",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "No Gum As Issued ",
        grade: "Good/Very Good",
        price: 0.30,
        location: "SL01-0001-10-04",
        paypalId: "SF39WLM3FSM6Q"
    },
    {
        scott: "RE191",
        condition: "Mint",
        hinged: "Never Hinged",
        gum: "No Gum As Issued ",
        grade: "Good/Very Good",
        price: 0.30,
        location: "SL01-0002-01-01",
        paypalId: "D7PZVYVYDW4RU"
    },
];

// =========================
// 2) CONFIG
// =========================
const PAGE_SIZE = 25; // render only 10 stamps per page

// =========================
// 3) INTERNAL STATE
// =========================
let currentPage = 1;
let lastTotalPages = 1; // updated on each render

// =========================
// 4) DOM HELPERS
// =========================
const $ = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);
const contentEl = () => document.querySelector("article.content");

// Debounce for search input
function debounce(fn, ms = 200) {
    let t;
    return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), ms);
    };
}

function uniqueSorted(values) {
    return Array.from(new Set(values)).filter(Boolean).sort((a, b) => String(a).localeCompare(String(b), undefined, {
        numeric: true
    }));
}

// Robust Scott sorting: prefix letters, number, suffix letters (e.g., "C115", "219D")
function scottKey(s) {
    const str = String(s);
    const m = str.match(/^([A-Za-z]*)(\d+)?([A-Za-z]*)$/);
    if (!m) return {
        prefix: str,
        num: Number.NaN,
        suffix: ""
    };
    return {
        prefix: m[1] || "",
        num: m[2] ? parseInt(m[2], 10) : Number.NaN,
        suffix: m[3] || ""
    };
}

function compareScottAsc(a, b) {
    const A = scottKey(a.scott),
        B = scottKey(b.scott);
    if (A.prefix !== B.prefix) return A.prefix.localeCompare(B.prefix);
    if (!Number.isNaN(A.num) && !Number.isNaN(B.num) && A.num !== B.num) return A.num - B.num;
    if (Number.isNaN(A.num) && !Number.isNaN(B.num)) return 1;
    if (!Number.isNaN(A.num) && Number.isNaN(B.num)) return -1;
    return A.suffix.localeCompare(B.suffix) || String(a.scott).localeCompare(String(b.scott));
}

function compareScottDesc(a, b) {
    return -compareScottAsc(a, b);
}

// =========================
// 5) PAYPAL LAZY INIT
// =========================
let paypalIO; // IntersectionObserver instance
let paypalReadyPromise; // singleton promise that resolves when cartPaypal is ready

function whenPaypalReady() {
    if (paypalReadyPromise) return paypalReadyPromise;
    paypalReadyPromise = new Promise((resolve) => {
        if (window.cartPaypal?.AddToCart) return resolve();
        const iv = setInterval(() => {
            if (window.cartPaypal?.AddToCart) {
                clearInterval(iv);
                resolve();
            }
        }, 150);
        // safety: also resolve after 10s even if not found to avoid hanging
        setTimeout(() => {
            clearInterval(iv);
            resolve();
        }, 10000);
    });
    return paypalReadyPromise;
}

function initPaypalForSection(sectionEl) {
    const btn = sectionEl.querySelector("paypal-add-to-cart-button");
    const id = btn?.getAttribute("data-id");
    if (!id) return;
    whenPaypalReady().then(() => {
        if (window.cartPaypal?.AddToCart) {
            try {
                window.cartPaypal.AddToCart({
                    id
                });
            } catch {}
        }
    });
}

function lazyInitPaypal(sectionEl) {
    // Fallback: if IntersectionObserver isn't supported, init immediately
    if (!("IntersectionObserver" in window)) {
        initPaypalForSection(sectionEl);
        return;
    }
    if (!paypalIO) {
        paypalIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                initPaypalForSection(entry.target);
                paypalIO.unobserve(entry.target);
            });
        }, {
            root: null,
            threshold: 0.1
        });
    }
    paypalIO.observe(sectionEl);
}

// =========================
// 6) RENDERING
// =========================
function makeSection(stamp) {
    const s = document.createElement("section");
    s.className = "stamp";
    s.dataset.scott = stamp.scott;
    s.dataset.condition = stamp.condition;
    s.dataset.hinged = stamp.hinged;
    s.dataset.gum = stamp.gum;
    s.dataset.grade = stamp.grade || "";
    s.dataset.price = String(stamp.price);
    s.dataset.location = stamp.location;

    const btn = document.createElement("paypal-add-to-cart-button");
    btn.setAttribute("data-id", stamp.paypalId);
    s.appendChild(btn);

    // Lazily initialize PayPal for this section when visible
    lazyInitPaypal(s);
    return s;
}

function renderPage(data) {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = data.slice(start, start + PAGE_SIZE);

    const root = contentEl();
    root.innerHTML = "";

    if (page.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No stamps match your filters.";
        root.appendChild(empty);
    } else {
        page.forEach(st => root.appendChild(makeSection(st)));
    }

    // render pagers above and below
    renderPagerAt("pagerTop", data.length, "top");
    renderPagerAt("pagerBottom", data.length, "bottom");

    // Clean up any legacy single pager if present
    const legacy = byId("pager");
    if (legacy) legacy.remove();
}

// Unified page change helper with optional scroll-to-top
function goToPage(n, scrollTop = true) {
    const clamped = Math.min(Math.max(1, n), lastTotalPages);
    if (clamped === currentPage) return;
    currentPage = clamped;
    refresh();
    if (scrollTop) {
        // wait for DOM update then scroll
        setTimeout(() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }), 0);
    }
}

// New: generic pager renderer for a specific container, with TEXT jump-to
function renderPagerAt(containerId, total, position) {
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    lastTotalPages = totalPages;
    currentPage = Math.min(Math.max(1, currentPage), totalPages);

    let pager = byId(containerId);
    if (!pager) {
        pager = document.createElement("div");
        pager.id = containerId;
        pager.style.display = "flex";
        pager.style.gap = "8px";
        pager.style.alignItems = "center";
        pager.style.flexWrap = "wrap";
        pager.style.margin = "12px 0";

        if (position === "top") {
            // Insert before the content section
            contentEl().insertAdjacentElement("beforebegin", pager);
        } else {
            // Insert after the content section
            contentEl().insertAdjacentElement("afterend", pager);
        }
    }
    pager.innerHTML = "";

    const makeBtn = (label, disabled, onClick) => {
        const b = document.createElement("button");
        b.textContent = label;
        b.disabled = disabled;
        b.addEventListener("click", onClick);
        return b;
    };

    // First & Prev
    pager.appendChild(makeBtn("« First", currentPage === 1, () => goToPage(1)));
    pager.appendChild(makeBtn("‹ Prev", currentPage === 1, () => goToPage(currentPage - 1)));

    // Info
    const info = document.createElement("span");
    info.textContent = `Page ${currentPage} of ${totalPages}`;
    pager.appendChild(info);

    // Jump-to TEXT input
    const jumpWrap = document.createElement("span");
    jumpWrap.style.display = "inline-flex";
    jumpWrap.style.alignItems = "center";
    jumpWrap.style.gap = "6px";
    jumpWrap.style.marginLeft = "8px";

    const jumpLabel = document.createElement("label");
    jumpLabel.textContent = "Jump to:";
    jumpLabel.setAttribute("for", containerId + "-jump");
    jumpWrap.appendChild(jumpLabel);

    const input = document.createElement("input");
    input.id = containerId + "-jump";
    input.type = "number";
    input.min = "1";
    input.max = String(totalPages);
    input.value = String(currentPage);
    input.placeholder = "Page #";
    input.style.width = "64px";
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const val = parseInt(input.value, 10);
            if (!Number.isFinite(val)) return;
            goToPage(val);
        }
    });
    jumpWrap.appendChild(input);

    const goBtn = document.createElement("button");
    goBtn.textContent = "Go";
    goBtn.addEventListener("click", () => {
        const val = parseInt(input.value, 10);
        if (!Number.isFinite(val)) return;
        goToPage(val);
    });
    jumpWrap.appendChild(goBtn);

    pager.appendChild(jumpWrap);

    // Next & Last
    pager.appendChild(makeBtn("Next ›", currentPage === totalPages, () => goToPage(currentPage + 1)));
    pager.appendChild(makeBtn("Last »", currentPage === totalPages, () => goToPage(totalPages)));
}

// =========================
// 7) FILTERING & SORTING
// =========================
function populateFilters(data) {
    const addOpts = (selectId, vals, keepLabel) => {
        const el = byId(selectId);
        if (!el) return;
        const first = el.firstElementChild?.outerHTML || `<option value="">${keepLabel || "All"}</option>`;
        el.innerHTML = first; // reset to first option only
        uniqueSorted(vals).forEach(v => {
            const opt = document.createElement("option");
            opt.value = v;
            opt.textContent = v;
            el.appendChild(opt);
        });
    };
    addOpts("conditionFilter", data.map(d => d.condition), "All Conditions");
    addOpts("hingedFilter", data.map(d => d.hinged), "All Hinging");
    addOpts("gumFilter", data.map(d => d.gum), "All Gum Conditions");

    // Optional: only if gradeFilter exists in HTML
    if (byId("gradeFilter")) {
        addOpts("gradeFilter", data.map(d => d.grade), "All Grades");
    }
}

function applyFiltersAndSort(all) {
    const q = (byId("searchBox")?.value || "").trim().toLowerCase();
    const cond = byId("conditionFilter")?.value || "";
    const hing = byId("hingedFilter")?.value || "";
    const gum = byId("gumFilter")?.value || "";
    const grade = byId("gradeFilter")?.value || "";
    const sort = byId("sortOptions")?.value || "";

    // Filter
    let out = all.filter(st => {
        const matchScott = !q || String(st.scott).toLowerCase().includes(q);
        const matchCond = !cond || st.condition === cond;
        const matchHing = !hing || st.hinged === hing;
        const matchGum = !gum || st.gum === gum;
        const matchGrade = !grade || st.grade === grade;
        return matchScott && matchCond && matchHing && matchGum && matchGrade;
    });

    // Sort
    switch (sort) {
        case "scott-asc":
            out.sort(compareScottAsc);
            break;
        case "scott-desc":
            out.sort(compareScottDesc);
            break;
        case "price-asc":
            out.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            out.sort((a, b) => b.price - a.price);
            break;
        default:
            /* no-op */
            ;
    }

    return out;
}

// =========================
// 8) WIRING & BOOT
// =========================
function wireControls() {
    const onChange = () => {
        currentPage = 1;
        refresh();
        setTimeout(() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }), 0);
    };
    const onType = debounce(onChange, 200);

    byId("searchBox")?.addEventListener("input", onType);
    byId("conditionFilter")?.addEventListener("change", onChange);
    byId("hingedFilter")?.addEventListener("change", onChange);
    byId("gumFilter")?.addEventListener("change", onChange);
    byId("gradeFilter")?.addEventListener("change", onChange); // optional
    byId("sortOptions")?.addEventListener("change", onChange);
}

function refresh() {
    const filtered = applyFiltersAndSort(stamps);
    renderPage(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    // Expected HTML (already in your USA2.htm):
    //  - <input id="searchBox">
    //  - <select id="conditionFilter"><option value="">All Conditions</option></select>
    //  - <select id="hingedFilter"><option value="">All Hinging</option></select>
    //  - <select id="gumFilter"><option value="">All Gum Conditions</option></select>
    //  - (optional) <select id="gradeFilter"><option value="">All Grades</option></select>
    //  - <select id="sortOptions">
    //       <option value="">Sort by</option>
    //       <option value="scott-asc">Scott # (Low → High)</option>
    //       <option value="scott-desc">Scott # (High → Low)</option>
    //       <option value="price-asc">Price (Low → High)</option>
    //       <option value="price-desc">Price (High → Low)</option>
    //     </select>
    //  - <article class="content"></article>
    populateFilters(stamps);
    wireControls();
    refresh();
});