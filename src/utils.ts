import { Type, Expose, Transform, plainToClass } from "class-transformer";
import "reflect-metadata";

export class Character {
    handle: string;
    role: Role | null;
    age: number;
    @Transform(
        (value) => {
            let map = new Map<StatAbbr, number>();
            for (const [key, val] of Object.entries(value))
                map.set(key as StatAbbr, val as number);
            return map;
        },
        { toClassOnly: true }
    )
    _stats: CharacterStats;
    run: number | null;
    leap: number | null;
    lift: number | null;
    carry: number | null;
    bodyType: string | null;
    bodyTypeModifier: number | null;
    save: number | null;
    humanityMax: number | null;
    style: Appearance | null;
    ethnicity: Ethnicity | null;
    language: Language | null;
    familyBackground: [string, string | string[]][] | null;
    motivation: [string, string][] | null;
    lifeEvents: (string | (string | Appearance | Enemy)[])[] | null;

    @Transform(
        (value) => {
            let map = new Map<string, number>();
            for (const [key, val] of Object.entries(value))
                map.set(key, val as number);
            return map;
        },
        { toClassOnly: true }
    )
    skills: Map<string, number>;

    constructor() {
        this.handle = "";
        this.age = 16;
        this.role = null;
        this._stats = genCleanStats();
        this.skills = new Map<string, number>();
        // derived stats
        this.run = null;
        this.leap = null;
        this.lift = null;
        this.carry = null;
        this.bodyType = null;
        this.bodyTypeModifier = null;
        this.save = null;
        this.humanityMax = null;
        this.style = null;
        this.ethnicity = null;
        this.language = null;
        this.familyBackground = null;
        this.motivation = null;
        this.lifeEvents = null;
    }

    set stats(newStats: CharacterStats) {
        this._stats = newStats;
        // use the new stats to recalc the derived stats
        this.run = getStatByAbbr(newStats, "MA") * 3;
        this.leap = this.run / 4;
        this.humanityMax = getStatByAbbr(newStats, "EMP") * 10;
        this.carry = getStatByAbbr(newStats, "BODY") * 10;
        this.lift = getStatByAbbr(newStats, "BODY") * 40;
        this.bodyType = bodyTypes[getStatByAbbr(newStats, "BODY")];
        this.bodyTypeModifier = bodyTypeModifiers.get(this.bodyType) || null;
        this.save = getStatByAbbr(newStats, "BODY");
    }

    get stats() {
        return this._stats;
    }

    public clone() {
        const newChar = new Character();
        newChar.handle = this.handle;
        newChar.role = this.role;
        newChar.age = this.age;
        newChar.stats = this._stats;
        newChar._stats = this.stats;
        newChar.skills = this.skills;

        newChar.run = this.run;
        newChar.leap = this.leap;
        newChar.lift = this.lift;
        newChar.carry = this.carry;
        newChar.bodyType = this.bodyType;
        newChar.bodyTypeModifier = this.bodyTypeModifier;
        newChar.save = this.save;
        newChar.humanityMax = this.humanityMax;
        newChar.style = this.style;
        newChar.ethnicity = this.ethnicity;
        newChar.language = this.language;
        newChar.familyBackground = this.familyBackground;
        newChar.motivation = this.motivation;
        newChar.lifeEvents = this.lifeEvents;

        return newChar;
    }
}

export function genAppearance(): Appearance {
    return {
        clothes: Object.values(clothes)[rollD10() - 1],
        hair: Object.values(hairStyle)[rollD10() - 1],
        affectation: Object.values(affectations)[rollD10() - 1],
    };
}

export type Enemy = {
    type: string;
    cause: string;
    angrySide: string;
    yourResponse: string;
    theirSupport: string;
};

export type Appearance = {
    clothes: Clothes;
    hair: HairStyle;
    affectation: Affectation;
};

export type Clothes =
    | "Biker leathers"
    | "Blue jeans"
    | "Corporate suits"
    | "Jumpsuits"
    | "Miniskirts"
    | "High Fashion"
    | "Cammos"
    | "Normal clothes"
    | "Nude"
    | "Bag lady chic";

export type HairStyle =
    | "Mohawk"
    | "Long & Ratty"
    | "Short & Spiked"
    | "Wild & all over"
    | "Bald"
    | "Striped"
    | "Tinted"
    | "Neat, short"
    | "Short, curly"
    | "Long, straight";

export type Affectation =
    | "Tattoos"
    | "Mirrorshades"
    | "Ritual Scars"
    | "Spiked gloves"
    | "Nose Rings"
    | "Earrings"
    | "Long fingernails"
    | "Spike heel boots"
    | "Weird contact lenses"
    | "Fingerless gloves";

export const bodyTypes = [
    "",
    "",
    "Very Weak",
    "Weak",
    "Weak",
    "Average",
    "Average",
    "Average",
    "Strong",
    "Strong",
    "Very Strong",
];

export const bodyTypeModifiers = new Map([
    ["Very Weak", 0],
    ["Weak", -1],
    ["Average", -2],
    ["Strong", -3],
    ["Very Strong", -4],
    ["Superhuman", -5],
]);

export type StatAbbr =
    | "INT"
    | "REF"
    | "TECH"
    | "COOL"
    | "ATT"
    | "LUCK"
    | "MA"
    | "BODY"
    | "EMP";

export function getStatByAbbr(stats: CharacterStats, abbr: StatAbbr): number {
    const retStat = stats.get(abbr);
    if (retStat !== undefined) {
        return retStat;
    } else {
        throw Error(
            `Stats ${JSON.stringify(stats)} does not contain abbr ${abbr}`
        );
    }
}

export type CharacterStats = Map<StatAbbr, number>;

export const statNames: { name: string; abbr: StatAbbr }[] = [
    { name: "Intelligence", abbr: "INT" },
    { name: "Reflexes", abbr: "REF" },
    { name: "Technology", abbr: "TECH" },
    { name: "Cool", abbr: "COOL" },
    { name: "Attractiveness", abbr: "ATT" },
    { name: "Luck", abbr: "LUCK" },
    { name: "Movement Allowence", abbr: "MA" },
    { name: "Body", abbr: "BODY" },
    { name: "Empathy", abbr: "EMP" },
];

export const getFullStatName = new Map(
    statNames.map((val) => [val.abbr, val.name])
);
export const getStatAbbr = new Map(
    statNames.map((val) => [val.name, val.abbr])
);

export function rollD10s(num: number) {
    const rolls = [];
    for (let i = 0; i < num; i++) {
        rolls.push(rollD10());
    }
}

export function rollD10() {
    return Math.floor(Math.random() * Math.floor(10)) + 1;
}
export function rollD8() {
    return Math.floor(Math.random() * Math.floor(8)) + 1;
}
export function rollD6() {
    return Math.floor(Math.random() * Math.floor(6)) + 1;
}
export function rollD5() {
    return Math.floor(Math.random() * Math.floor(5)) + 1;
}
export function rollD3() {
    return Math.floor(Math.random() * Math.floor(3)) + 1;
}

export function genCleanStats(): Map<StatAbbr, number> {
    return new Map([
        ["INT", 0],
        ["REF", 0],
        ["TECH", 0],
        ["COOL", 0],
        ["ATT", 0],
        ["LUCK", 0],
        ["MA", 0],
        ["BODY", 0],
        ["EMP", 0],
    ]);
}

export const roles: Role[] = [
    "Cop",
    "Rocker",
    "Solo",
    "Media",
    "Nomad",
    "Netrunner",
    "Techie",
    "MedTechie",
    "Corp",
    "Fixer",
];
export type Role =
    | "Cop"
    | "Rocker"
    | "Solo"
    | "Media"
    | "Nomad"
    | "Netrunner"
    | "Techie"
    | "MedTechie"
    | "Corp"
    | "Fixer";

export const clothes: { [key: number]: Clothes } = {
    1: "Biker leathers",
    2: "Blue jeans",
    3: "Corporate suits",
    4: "Jumpsuits",
    5: "Miniskirts",
    6: "High Fashion",
    7: "Cammos",
    8: "Normal clothes",
    9: "Nude",
    10: "Bag lady chic",
};

export const hairStyle: { [key: number]: HairStyle } = {
    1: "Mohawk",
    2: "Long & Ratty",
    3: "Short & Spiked",
    4: "Wild & all over",
    5: "Bald",
    6: "Striped",
    7: "Tinted",
    8: "Neat, short",
    9: "Short, curly",
    10: "Long, straight",
};

export const affectations: { [key: number]: Affectation } = {
    1: "Tattoos",
    2: "Mirrorshades",
    3: "Ritual Scars",
    4: "Spiked gloves",
    5: "Nose Rings",
    6: "Earrings",
    7: "Long fingernails",
    8: "Spike heel boots",
    9: "Weird contact lenses",
    10: "Fingerless gloves",
};

type Ethnicity =
    | "African"
    | "Anglo-American"
    | "Japanese/Korean"
    | "Central European/Soviet"
    | "Pacific Islander"
    | "Chinese/Southeast Asian"
    | "Black American"
    | "Hispanic/American"
    | "Central/South American"
    | "European";

type Language =
    | "Bantu"
    | "Fante"
    | "Kongo"
    | "Ashanti"
    | "Zulu"
    | "Swahili"
    | "Japanese"
    | "Korean"
    | "Bulgarian"
    | "Russian"
    | "Czech"
    | "Polish"
    | "Ukranian"
    | "Slovak"
    | "Micronesian"
    | "Tagalog"
    | "Polynesian"
    | "Malayan"
    | "Sudanese"
    | "Indonesian"
    | "Hawaiian"
    | "Burmese"
    | "Cantonese"
    | "Mandarin"
    | "Thai"
    | "Tibetan"
    | "Vietnamese"
    | "English"
    | "Blackfolk"
    | "Spanish"
    | "English"
    | "Spanish"
    | "Portuguese"
    | "French"
    | "German"
    | "English"
    | "Spanish"
    | "Italian"
    | "Greek"
    | "Danish"
    | "Dutch"
    | "Norwegian"
    | "Swedish";

export const ethnicities: { origin: Ethnicity; languages: Language[] }[] = [
    { origin: "Anglo-American", languages: ["English"] },
    {
        origin: "African",
        languages: ["Bantu", "Fante", "Kongo", "Ashanti", "Zulu", "Swahili"],
    },
    { origin: "Japanese/Korean", languages: ["Japanese", "Korean"] },
    {
        origin: "Central European/Soviet",
        languages: [
            "Bulgarian",
            "Russian",
            "Czech",
            "Polish",
            "Ukranian",
            "Slovak",
        ],
    },
    {
        origin: "Pacific Islander",
        languages: [
            "Micronesian",
            "Tagalog",
            "Polynesian",
            "Malayan",
            "Sudanese",
            "Indonesian",
            "Hawaiian",
        ],
    },
    {
        origin: "Chinese/Southeast Asian",
        languages: [
            "Burmese",
            "Cantonese",
            "Mandarin",
            "Thai",
            "Tibetan",
            "Vietnamese",
        ],
    },
    { origin: "Black American", languages: ["English", "Blackfolk"] },
    { origin: "Hispanic/American", languages: ["Spanish", "English"] },
    {
        origin: "Central/South American",
        languages: ["Spanish", "Portuguese"],
    },
    {
        origin: "European",
        languages: [
            "French",
            "German",
            "English",
            "Spanish",
            "Italian",
            "Greek",
            "Danish",
            "Dutch",
            "Norwegian",
            "Swedish",
        ],
    },
];

export const familyRank = {
    1: "Corporate Executive",
    2: "Corporate Manager",
    3: "Corporate Technician",
    4: "Nomad Pack",
    5: "Pirate Fleet",
    6: "Gang family",
    7: "Crime Lord",
    8: "Combat Zone Poor",
    9: "Urban homeless",
    10: "Arcology family",
};

export const parentStatus = {
    okay: "Both parents are living",
    somethingHappened: "Something happened to one or both parents",
};

export const parentTragedy = {
    1: "Your parent(s) died in warfare",
    2: "Your parent(s) died in an accident",
    3: "Your parent(s) were murdered",
    4: "Your parent(s) have amnesia and don't remember you",
    5: "You never knew your parent(s)",
    6: "Your parent(s) are in hiding to protect you",
    7: "You were left with relatives for safekeeping",
    8: "You grew up on the street and never had parents",
    9: "Your parent(s) gave you up for adoption",
    10: "Your parent(s) sold you for money",
};

export const familyStatusOptions = {
    danger: "Family status in danger, and you risk losing everything",
    okay: "Family status is OK, even if parents are missing or dead",
};

export const familyTragedy = {
    1: "Family lost everything through betrayal",
    2: "Family lost everything through bad management",
    3: "Family exiled or otherwise driven from their original home/ nation/ corporation",
    4: "Family is imprisoned and you alone escaped",
    5: "Family vanished. You are the only remaining member",
    6: "Family was murdered or killed, and you were the only survivor",
    7: "Family is involved in a longterm conspiracy, organization or assocation, such as a crime family or revolutionary group",
    8: "Your family was scattered to the winds due to misfortune",
    9: "Your family is cursed with a hereditary feud that has lasted for generations",
    10: "You are the inheritor of a family debt; you must honor this debt before moving on with your life",
};

export const childEnv = {
    1: "Spent on the street, with no adult supervision",
    2: "Spent in a safe corporate suburbia",
    3: "In a Nomad Pack moving from town to town",
    4: "In a decarying, once upscale neighborhood",
    5: "In a defended corporate zone in the central City",
    6: "In the heart of the combat zone",
    7: "In a small village or town far from the city",
    8: "In a large archology city",
    9: "In an aquatic pirate pack",
    10: "On a corporate controlled farm or research facility",
};

export const siblingGenders = {
    1: "male",
    2: "female",
};

export const siblingAges = {
    1: "older",
    2: "younger",
    3: "twin",
};

export const siblingFeelings = {
    1: "dislike you",
    2: "like you",
    3: "are neutral towards you",
    4: "hero worship you",
    5: "hate you",
};

export const manualSiblingsList = {
    1: "only child",
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
};

export const persTraits = {
    1: "Shy and secretive",
    2: "Rebellious, antisocial, violent",
    3: "Arrogant, proud, aloof",
    4: "Moody, rash and headstrong",
    5: "Picky, fussy and nervous",
    6: "Stable and serious",
    7: "Silly and fluffheaded",
    8: "Sneaky and deceptive",
    9: "Intellectual and detached",
    10: "Friendly and outgoing",
};

export const persValued = {
    1: "A parent (or guardian)",
    2: "Brother or sister",
    3: "Lover",
    4: "Friend",
    5: "Yourself",
    6: "A pet",
    7: "Teacher or mentor",
    8: "Public figure",
    9: "A personal hero",
    10: "No one",
};

export const youValue = {
    1: "Money",
    2: "Honor",
    3: "Your word",
    4: "Honesty",
    5: "Knowledge",
    6: "Vengeance",
    7: "Love",
    8: "Power",
    9: "Having a good time",
    10: "Friendship",
};

export const howFeel = {
    1: "Neutral",
    2: "Neutral",
    3: "I like almost everyone",
    4: "I hate almost everyone",
    5: "People are tools. Use them for your own goals and discard them",
    6: "Every person is a valuable individual",
    7: "People are obstacles to be destroyed if they cross me",
    8: "People are untrustworthy. Don't depend on anyone",
    9: "Wipe 'em all out and give the place to the cockroaches",
    10: "People are wonderful",
};

export const valuedPos = {
    1: "A weapon",
    2: "A tool",
    3: "A piece of clothing",
    4: "A photograph",
    5: "A book or diary",
    6: "A recording",
    7: "A musical instrument",
    8: "A piece of jewelry",
    9: "A toy",
    10: "A letter",
};

// Referenced by createPickupOpt()
export const skills = {
    special: {
        name: "Special Abilities",
        Cop: "Authority",
        Rocker: "Charismatic Leadership",
        Solo: "Combat Sense",
        Media: "Credibility",
        Nomad: "Family",
        Netrunner: "Interface",
        Techie: "Jury Rig",
        MedTechie: "Medical Tech",
        Corp: "Resources",
        Fixer: "Streetdeal",
    },
    ATT: {
        name: "Attractiveness Skills",
        ATT01: "Personal Grooming",
        ATT02: "Wardrobe & Style",
    },
    BODY: {
        name: "Body Skills",
        BODY01: "Endurance",
        BODY02: "Strength Feat",
        BODY03: "Swimming",
    },
    COOL: {
        name: "Cool / Will Skills",
        COOL01: "Interrogation",
        COOL02: "Intimidate",
        COOL03: "Oratory",
        COOL04: "Resist Torture/Drugs",
        COOL05: "Streetwise",
    },
    EMP: {
        name: "Empathy Skills",
        EMP01: "Human Perception",
        EMP02: "Interview",
        EMP03: "Leadership",
        EMP04: "Seduction",
        EMP05: "Social",
        EMP06: "Persuasion and Fast Talk",
        EMP07: "Perform",
    },
    INT: {
        name: "Intelligence Skills",
        INT01: "Accounting",
        INT02: "Anthropology",
        INT03: "Awareness / Notice",
        INT04: "Biology",
        INT05: "Botany",
        INT06: "Chemistry",
        INT07: "Composition",
        INT08: "Diagnose Illness",
        INT09: "Ed./General Knowledge",
        INT10: "Expert",
        INT11: "Gamble",
        INT12: "Geology",
        INT13: "Hide/Evade",
        INT14: "History",
        INT15: "Know Language",
        INT16: "Library Search",
        INT17: "Mathematics",
        INT18: "Physics",
        INT19: "Programming",
        INT20: "Shadow/Track",
        INT21: "Stock Market",
        INT22: "System Knowledge",
        INT23: "Teaching",
        INT24: "Wilderness Survival",
        INT25: "Zoology",
    },
    REF: {
        name: "Reflex Skills",
        REF01: "Archery",
        REF02: "Athletics",
        REF03: "Brawling",
        REF04: "Dance",
        REF05: "Dodge & Escape",
        REF06: "Driving",
        REF07: "Fencing",
        REF08: "Handgun",
        REF09: "Heavy Weapons",
        REF10: "Martial Art",
        REF11: "Melee",
        REF12: "Motorcycle",
        REF13: "Operate Heavy Machinery",
        REF14: "Pilot Gyro",
        REF15: "Pilot Fixed Wing",
        REF16: "Pilot Dirigible",
        REF17: "Pilot Vect. Thrust Vehicle",
        REF18: "Rifle",
        REF19: "Stealth",
        REF20: "Submachinegun",
    },
    TECH: {
        name: "Tech Skills",
        TECH01: "Aero Tech",
        TECH02: "AV Tech",
        TECH03: "Basic Tech",
        TECH04: "Cryotank Operation",
        TECH05: "Cyberdeck Design",
        TECH06: "CyberTech",
        TECH07: "Demolitions",
        TECH08: "Disguise",
        TECH09: "Electronics",
        TECH10: "Electronic Security",
        TECH11: "First Aid",
        TECH12: "Forgery",
        TECH13: "Gyro Tech",
        TECH14: "Paint or Draw",
        TECH15: "Photo & Film",
        TECH16: "Pharmaceuticals",
        TECH17: "Pick Lock",
        TECH18: "Pick Pocket",
        TECH19: "Play Instrument",
        TECH20: "Weaponsmith",
    },
};

// build a map of stat eg: "REF" to skill eg: "Fencing"
export const skillStatMap = new Map<string, string[]>();
for (const [key, skillObj] of Object.entries(skills)) {
    const skills = Object.entries(skillObj)
        .filter(([key, _]) => key !== "name")
        .map(([_, val]) => val);
    skillStatMap.set(key, skills);
}

// Career Skills from pg. 44
export const career = new Map([
    [
        "Solo",
        [
            skills.special.Solo,
            skills.INT.INT03,
            skills.REF.REF08,
            skills.REF.REF03,
            skills.REF.REF10,
            skills.REF.REF11,
            skills.TECH.TECH20,
            skills.REF.REF18,
            skills.REF.REF02,
            skills.REF.REF20,
            skills.REF.REF19,
        ],
    ],
    [
        "Corp",
        [
            skills.special.Corp,
            skills.INT.INT03,
            skills.EMP.EMP01,
            skills.INT.INT09,
            skills.INT.INT16,
            skills.EMP.EMP05,
            skills.EMP.EMP06,
            skills.INT.INT21,
            skills.ATT.ATT02,
            skills.ATT.ATT01,
        ],
    ],
    [
        "Media",
        [
            skills.special.Media,
            skills.INT.INT03,
            skills.INT.INT07,
            skills.INT.INT09,
            skills.EMP.EMP06,
            skills.EMP.EMP01,
            skills.EMP.EMP05,
            skills.COOL.COOL05,
            skills.TECH.TECH15,
            skills.EMP.EMP02,
        ],
    ],
    [
        "Nomad",
        [
            skills.special.Nomad,
            skills.INT.INT03,
            skills.BODY.BODY01,
            skills.REF.REF11,
            skills.REF.REF18,
            skills.REF.REF06,
            skills.TECH.TECH03,
            skills.INT.INT24,
            skills.REF.REF03,
            skills.REF.REF02,
        ],
    ],
    [
        "Techie",
        [
            skills.special.Techie,
            skills.INT.INT03,
            skills.TECH.TECH03,
            skills.TECH.TECH06,
            skills.INT.INT23,
            skills.INT.INT09,
            skills.TECH.TECH09,
            skills.TECH.TECH01,
            skills.TECH.TECH02,
            skills.TECH.TECH20,
            skills.TECH.TECH10,
            skills.TECH.TECH13,
        ],
    ],
    [
        "Cop",
        [
            skills.special.Cop,
            skills.INT.INT03,
            skills.REF.REF08,
            skills.EMP.EMP01,
            skills.REF.REF02,
            skills.INT.INT09,
            skills.REF.REF03,
            skills.REF.REF11,
            skills.COOL.COOL01,
            skills.COOL.COOL05,
        ],
    ],
    [
        "Rocker",
        [
            skills.special.Rocker,
            skills.INT.INT03,
            skills.EMP.EMP07,
            skills.ATT.ATT02,
            skills.INT.INT07,
            skills.REF.REF03,
            skills.TECH.TECH19,
            skills.COOL.COOL05,
            skills.EMP.EMP06,
            skills.EMP.EMP04,
        ],
    ],
    [
        "MedTechie",
        [
            skills.special.MedTechie,
            skills.INT.INT03,
            skills.TECH.TECH03,
            skills.INT.INT08,
            skills.INT.INT09,
            skills.TECH.TECH04,
            skills.INT.INT16,
            skills.TECH.TECH16,
            skills.INT.INT25,
            skills.EMP.EMP01,
        ],
    ],
    [
        "Fixer",
        [
            skills.special.Fixer,
            skills.INT.INT03,
            skills.TECH.TECH12,
            skills.REF.REF08,
            skills.REF.REF03,
            skills.REF.REF11,
            skills.TECH.TECH17,
            skills.TECH.TECH18,
            skills.COOL.COOL02,
            skills.EMP.EMP06,
        ],
    ],
    [
        "Netrunner",
        [
            skills.special.Netrunner,
            skills.INT.INT03,
            skills.TECH.TECH03,
            skills.INT.INT09,
            skills.INT.INT22,
            skills.TECH.TECH06,
            skills.TECH.TECH05,
            skills.INT.INT07,
            skills.TECH.TECH09,
            skills.INT.INT19,
        ],
    ],
    ["", []],
]);

export const disaster = {
    1: {
        title: "Financial Loss or Debt",
        detail:
            "You have lost XXX Eurodollars. If you can't pay this now, you have a debt to pay, in cash--or blood.",
    },
    2: {
        title: "Imprisonment",
        detail:
            "You have been in prison, or possibly held hostage (your choice) for XXX months.",
    },
    3: {
        title: "Illness or addiction",
        detail:
            "You have contracted either an illness or" +
            " drug habit in this time. Lose 1 point of REF permanently as a result.",
    },
    4: {
        title: "Betrayal. You have been backstabbed in some manner",
        detail:
            "Roll another 1D10. 1-3, you are being blackmailed. 4-7 a secret was exposed. 8-10, you were betrayed by a close friend in either romance or career (your choice).",
    },
    5: {
        title: "Accident",
        detail:
            "You were in some kind of terrible accident. Roll" +
            " 1D10. 1-4, you were terribly disfigured and must subtract -5 from your ATT." +
            " 5-6 you were hospitalized for 1D10 months that year. 7-8, you have lost" +
            " 1D10 months of memory that year. 9-10, you constantly relive nightmares" +
            " (8 in 10 chance each night) of the accident and wake up screaming",
    },
    6: {
        title: "Lover, friend or relative killed",
        detail:
            "You lost someone you really cared about. 1-5, they died accidentally. 6-8 they were murdered" +
            " by unknown parties. 9-10, they were murdered and you know who did it. You" +
            " just need the proof.",
    },
    7: {
        title: "False Accusation",
        detail:
            "You were set up. Roll 1D10. 1-3, the accusation is theft. 4-5 it's cowardice. 6-8 it's murder. 9 it's rape 10, it's lying or betrayal",
    },
    8: {
        title: "Hunted by the law",
        detail:
            "You are hunted by the law for crimes" +
            " you may or may not have committed (your choice). Roll 1D10. 1-3 only" +
            " a couple cops want you. 4-6 it's the entire local force. 7-8, it's the" +
            " State police or Militia. 9-10 it's the FBI or equivalent national police force.",
    },
    9: {
        title: "Hunted by a Corporation",
        detail:
            "You have angered some corporate" +
            " honcho. Roll 1D10. 1-3 it's a small, local firm. 4-6 it's a larger corp with offices statewide. 7-8 it's a big, national corp with agents in major cities nationwide. 9-10; it's a huge multinational with armies, ninja and spies everywhere.",
    },
    10: {
        title: "Mental or physical incapacitation",
        detail:
            "You have experienced" +
            " some type of mental or physical breakdown. Roll 1D10. 1-3 it's some type" +
            " of nervous disorder, probably from a bioplague -- lose 1pt REF. 4-7 it's" +
            " some kind of mental problem; you suffer anxiety attacks and phobias. Lose" +
            " 1pt from your CL stat. 8-10 it's a major psychosis. You hear voices" +
            " are violent, irrational, depressive. Lose 1pt from CL, 1pt from REF",
    },
};

export const getLucky = {
    // Life Events table output, Detail column data
    1: {
        title: "Make a Powerful Connection in City Government",
        detail:
            "Roll 1D10" +
            " 1-4 it's the Police. 5-7 it's in DA office. 8-10 its the Mayor",
    },
    2: {
        title: "Financial Windfall",
        detail: "You won 1D10x100 Euros",
    },
    3: { title: "Big Score", detail: "You scored 1D10x100 Eurodollars" },
    4: {
        title: "Find a Sensei (Teacher)",
        detail:
            "Begin a new Martial Art at +2, or add +1 to an existing Martial Art",
    },
    5: {
        title: "Find a Teacher",
        detail: "Add +1 to any INT based skill, or begin new at +2",
    },
    6: {
        title: "Favor with a Powerful Corporate Executive",
        detail: "They owe you a favor",
    },
    7: {
        title: "Local Nomad Pack Befriends You",
        detail:
            "Call on them for one favor a month, " +
            " equivalent to Family special ability +2",
    },
    8: {
        title: "Make Friend on Police Force",
        detail: "You may use them for information at".concat(
            " a level of +2 Streetwise on any police related situation."
        ),
    },
    9: {
        title: "Local Boostergang likes you",
        detail:
            "You can call on them for" +
            " one favor a month, equivalent to Family special ability of +2. Don't push it",
    },
    10: {
        title: "Find a combat teacher",
        detail:
            "Add +1 to any weapon skill w/ exception" +
            " of Martial Arts or Brawling, or begin a new combat skill at +2",
    },
};

export const disasterResponse = [
    "Clear your name",
    "Clear your name",
    "Live it down and try to forget it.",
    "Live it down and try to forget it.",
    "Hunt down those responsible and make them pay!",
    "Hunt down those responsible and make them pay!",
    "Get what's rightfully yours",
    "Get what's rightfully yours",
    "Save, if possible, anyone else involved in the situtation.",
    "Save, if possible, anyone else involved in the situtation.",
];

export const friendMade = [
    "who is like a big brother/sister to you",
    "who is like a kid sister/brother to you",
    "who is a teacher or mentor",
    "who is a partner or coworker",
    "who is an old lover (choose which one)",
    "who is an old enemy (choose which one)",
    "who is like a foster parent to you",
    "who is a relative",
    "by reconnecting with an old childhood friend",
    "who you met through a common interest",
];

export const enemy = {
    enemyMade: {
        1: "an Ex friend",
        2: "an Ex lover",
        3: "a Relative",
        4: "a Childhood enemy",
        5: "a Person working for you",
        6: "a Person you work for",
        7: "a Partner or co-worker",
        8: "a Booster gang member",
        9: "a Corporate Executive",
        10: "a Government Official",
    },
    enemyCause: {
        1: "Caused the other to lose face or status",
        2: "Caused the loss of a lover, friend or relative",
        3: "Caused a major humiliation",
        4: "Accused the other of cowardice or other personal flaw",
        5: "Caused a physical disability",
        6: "Deserted or betrayed the other",
        7: "Turned down the other's offer of job or romantic involvement",
        8: "Just didn't like each other",
        9: "Was a romantic rival",
        10: "Foiled plans of the other",
    },
    whoIsAngry: {
        1: "They hate you",
        2: "You hate them",
        3: "The feeling's mutual",
    },
    whatDo: {
        1: "Go into a murderous killing rage",
        2: "Avoid the scum",
        3: "Backstab them indirectly",
        4: "Ignore them",
        5: "Rip into them verbally",
    },
    whatThrow: {
        1: "Just themselves",
        2: "Them and a few friends",
        3: "An entire gang",
        4: "A small corporation",
        5: "A Large corporation",
        6: "An entire government agency",
    },
};

export const romance = {
    romanceEvent: {
        1: "Happy Love Affair",
        2: "Tragic Love Affair",
        3: "Love Affair With Problems",
        4: "Fast affairs and Hot Dates",
    },
    romanceTragic: {
        1: "Lover died in an accident",
        2: "Lover mysteriously vanisehd",
        3: "It didnt work out",
        4: "A personal goal or vendetta came between you",
        5: "Lover kidnapped",
        6: "Lover went insane",
        7: "Lover committed suicide",
        8: "Lover killed in a fight",
        9: "Rival cut you out of the action",
        10: "Lover imprisoned or exiled",
    },
    romanceProblems: {
        1: "Your lover's friends/family hate you",
        2: "Your lover's friends/family would use any means to get rid of you",
        3: "Your friends/family hate your lover",
        4: "One of you has a romantic rival",
        5: "You are seperated in some way",
        6: "You fight constantly",
        7: "You're professional rivals",
        8: "One of you is insanely jealous",
        9: "One of you is messing around",
        10: "You have conflicting backgrounds and families",
    },
    romanceMutalFeel: {
        1: "They still love you",
        2: "You still love them",
        3: "You still love each other",
        4: "You hate them",
        5: "They hate you",
        6: "You hate each other",
        7: "You're friends",
        8: "No feelings either way; its over",
        9: "You like them, they hate you",
        10: "They like you, you hate them",
    },
};
