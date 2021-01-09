import {
    childEnv,
    familyRank,
    familyStatusOptions,
    familyTragedy,
    howFeel,
    parentStatus,
    parentTragedy,
    persTraits,
    persValued,
    rollD10,
    siblingFeelings,
    valuedPos,
    youValue,
    disaster,
    getLucky,
    disasterResponse,
    friendMade,
    affectations,
    clothes,
    hairStyle,
    enemy,
    rollD5,
    rollD3,
    rollD6,
    romance,
    Appearance,
    genAppearance,
    Enemy,
} from "./utils";

export function familyBackground(): [string, string | string[]][] {
    const output: [string, string | string[]][] = [];
    const ranking = Object.values(familyRank)[rollD10() - 1];
    output.push(["Family Ranking", ranking]);

    const parentRoll = rollD10() <= 6 ? 0 : 1;
    const parentStat = Object.values(parentStatus)[parentRoll];
    output.push(["Parent Status", parentStat]);

    if (parentRoll === 0) {
        const familyStatRoll = rollD10() <= 6 ? 0 : 1;
        const familyStat = Object.values(familyStatusOptions)[familyStatRoll];
        output.push(["Family Status", familyStat]);

        if (familyStatRoll === 0) {
            const famTradg = Object.values(familyTragedy)[rollD10() - 1];
            output.push(["Family Tragedy", famTradg]);
        }

        const childEnviron = Object.values(childEnv)[rollD10() - 1];
        output.push(["Child Environment", childEnviron]);

        const sibRoll = rollD10();
        const siblingCount = sibRoll >= 8 ? 0 : sibRoll;
        const siblings = [];
        for (let i = 0; i < siblingCount; i++) {
            const gender = rollD10() % 2 === 0 ? "brother" : "sister";

            const ageRoll = rollD10();
            const age =
                ageRoll <= 5 ? "older" : ageRoll <= 9 ? "younger" : "twin";

            const sibVibe = Object.values(siblingFeelings)[
                Math.ceil(rollD10() / 2) - 1
            ];
            siblings.push(`${age} ${gender}, They ${sibVibe}`);
        }
        output.push(["Siblings", siblings]);
    } else {
        const parentTradj = Object.values(parentTragedy)[rollD10() - 1];
        output.push(["Parent Tragedy", parentTradj]);
    }

    return output;
}

export function motivation(): [string, string][] {
    const output: [string, string][] = [];
    output.push([
        "Personality Traits",
        Object.values(persTraits)[rollD10() - 1],
    ]);
    output.push(["Who you value", Object.values(persValued)[rollD10() - 1]]);
    output.push(["What you value", Object.values(youValue)[rollD10() - 1]]);
    output.push([
        "How you feel about People",
        Object.values(howFeel)[rollD10() - 1],
    ]);
    output.push(["Valued Possession", Object.values(valuedPos)[rollD10() - 1]]);

    return output;
}

export function lifeEvents(
    age: number
): (string | (string | Appearance | Enemy)[])[] {
    const output: (string | (string | Appearance | Enemy)[])[] = [];

    for (let year = 17; year <= age; year++) {
        const roll = rollD10();
        if (roll <= 3) {
            output.push(bigProblemsBigWins());
        } else if (roll <= 6) {
            output.push(friendsAndEnemies());
        } else if (roll <= 8) {
            output.push(romanticInvolvement());
        } else {
            output.push("Nothing happened this year");
        }
    }

    return output;
}

function bigProblemsBigWins(): string | string[] {
    const isLucky = rollD10() % 2 === 0;
    if (isLucky) {
        const thisLuck = Object.values(getLucky)[rollD10() - 1];
        if (
            thisLuck.title === "Make a Powerful Connection in City Government"
        ) {
            let person = "they're in the Police";
            const roll = rollD10();
            if (roll >= 5) person = "they're in the DA's office.";
            if (roll >= 8) person = "they're the Mayor.";
            return [thisLuck.title, person];
        } else if (
            (thisLuck.title =
                "Financial Windfall" || thisLuck.title === "Big Score")
        ) {
            return [
                thisLuck.title,
                thisLuck.detail.replace(
                    "1D10x100",
                    (rollD10() * 100).toString()
                ),
            ];
        } else {
            return [thisLuck.title, thisLuck.detail];
        }
    } else {
        const thisDisaster = Object.values(disaster)[rollD10() - 1];
        if (thisDisaster.title === "Financial Loss or Debt") {
            return [
                thisDisaster.title,
                thisDisaster.detail.replace(
                    "XXX",
                    (rollD10() * 100).toString()
                ),
            ];
        } else if (thisDisaster.title === "Imprisonment") {
            return [
                thisDisaster.title,
                thisDisaster.detail.replace("XXX", rollD10().toString()),
            ];
        } else if (
            thisDisaster.title ===
            "Betrayal. You have been backstabbed in some manner"
        ) {
            const betrayalRoll = rollD10();
            return [
                thisDisaster.title,
                betrayalRoll <= 3
                    ? "you are being blackmailed"
                    : betrayalRoll <= 7
                    ? "a secret was exposed"
                    : "you were betrayed by a close friend in either romance or career (your choice).",
            ];
        } else if (thisDisaster.title === "Accident") {
            const accidentRoll = rollD10();
            let accident = "";
            if (accidentRoll <= 4) {
                accident =
                    "you were terribly disfigured and must subtract -5 from your ATT.";
            } else if (accidentRoll <= 6) {
                accident = `you were hospitalized for ${rollD10()} months that year.`;
            } else if (accidentRoll <= 8) {
                accident = `you lost ${rollD10()} months of memory that year.`;
            } else {
                accident = `you constantly relive nightmares  (8 in 10 chance each night) of the accident and wake up screaming`;
            }
            return [
                thisDisaster.title,
                "You were in some kind of terrible accident." + accident,
            ];
        } else if (thisDisaster.title === "Lover, friend or relative killed") {
            const roll = rollD10();
            return [
                thisDisaster.title,
                `You lost someone you really cared about, ${
                    roll <= 5
                        ? "they died accidentally."
                        : roll <= 8
                        ? "they were murdered by unknown parties."
                        : "they were murdered and you know who did it. You just need the proof."
                }`,
            ];
        } else if (thisDisaster.title === "False Accusation") {
            const roll = rollD10();
            let thisAccusation = "theft";
            if (roll >= 4) thisAccusation = "cowardice";
            if (roll >= 6) thisAccusation = "murder";
            if (roll === 9) thisAccusation = "rape";
            if (roll === 10) thisAccusation = "rape";
            return [
                thisDisaster.title,
                `You were set up and accused of ${thisAccusation}`,
            ];
        } else if (thisDisaster.title === "Hunted by the law") {
            const roll = rollD10();
            let status = "only a couple cops want you";
            if (roll >= 4) status = "it's the entire local force.";
            if (roll >= 7) status = "it's the State police or Militia.";
            if (roll >= 9)
                status = "it's the FBI or equivalent national police force.";
            return [
                thisDisaster.title,
                `You are hunted by the law for crimes ${status}`,
            ];
        } else if (thisDisaster.title === "Hunted by a Corporation") {
            const roll = rollD10();
            let status = "it's a small, local firm.";
            if (roll >= 4)
                status = "it's a larger corp with offices statewide.";
            if (roll >= 7)
                status =
                    "it's a big, national corp with agents in major cities nationwide.";
            if (roll >= 9)
                status =
                    "it's a huge multinational with armies, ninja and spies everywhere.";
            return [
                thisDisaster.title,
                `You have angered some corporate honcho ${status}`,
            ];
        } else if (thisDisaster.title === "Mental or physical incapacitation") {
            const roll = rollD10();
            let status =
                "it's some type of nervous disorder, probably from a bioplague -- lose 1pt REF.";
            if (roll >= 4)
                status =
                    "it's  some kind of mental problem; you suffer anxiety attacks and phobias. Lose 1pt from your CL stat.";
            if (roll >= 8)
                status =
                    " it's a major psychosis. You hear voices, are violent, irrational, depressive. Lose 1pt from CL, 1pt from REF";
            return [
                thisDisaster.title,
                `You have experienced some type of mental or physical breakdown. ${status}`,
            ];
        } else {
            return [
                thisDisaster.title,
                thisDisaster.detail,
                disasterResponse[rollD10() - 1],
            ];
        }
    }
}

function friendsAndEnemies(): (string | Appearance | Enemy)[] {
    const isFriend = rollD10() <= 5;
    if (isFriend) {
        return [`Made a Friend ${friendMade[rollD10() - 1]}`, genAppearance()];
    } else {
        return [
            `Made an Enemy`,
            {
                type: Object.values(enemy.enemyMade)[rollD10() - 1],
                cause: Object.values(enemy.enemyCause)[rollD10() - 1],
                angrySide: Object.values(enemy.whoIsAngry)[rollD3() - 1],
                yourResponse: Object.values(enemy.whatDo)[rollD5() - 1],
                theirSupport: Object.values(enemy.whatThrow)[rollD6() - 1],
            },
            genAppearance(),
        ];
    }
}

function romanticInvolvement(): string | string[] {
    const output: string[] = ["Romance"];

    const roll = rollD10();
    if (roll <= 4) {
        output.push("Happy Love Affair");
    } else if (roll === 5) {
        output.push("Tragic Love Affair");
        output.push(Object.values(romance.romanceTragic)[rollD10() - 1]);
    } else if (roll <= 7) {
        output.push("Love Affair with Problems");
        output.push(Object.values(romance.romanceProblems)[rollD10() - 1]);
        output.push(Object.values(romance.romanceMutalFeel)[rollD10() - 1]);
    } else {
        output.push("Fast Affairs and Hot Dates");
    }

    return output;
}
