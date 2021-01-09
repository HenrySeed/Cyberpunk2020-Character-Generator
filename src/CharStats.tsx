import React, { useState } from "react";
import StatTable from "./StatTable";
import {
    Character,
    genCleanStats,
    getFullStatName,
    getStatByAbbr,
    rollD8,
    StatAbbr,
} from "./utils";
import "./App.css";

interface statProps {
    char: Character;
    onCharChange: (prevChar: Character) => void;
}

const rollDescr = new Map([
    ["Random", "Randomly rolls points."],
    ["Fast", "Randomly Rolls 10 D10, but you can whoose which stat gets what."],
    ["Major Hero", "80 available points, you choose where to spend them."],
    [
        "Major Supporting Character",
        "70 available points, you choose where to spend them.",
    ],
    ["Minor Hero", "75 available points, you choose where to spend them."],
    [
        "Minor Supporting Character",
        "60 available points, you choose where to spend them.",
    ],
    ["Average", "50 available points, you choose where to spend them."],
    [
        "Manually Enter",
        "You choose how many points, you choose where to spend them.",
    ],
]);

function CharStats({ char, onCharChange }: statProps) {
    const [rollMethod, setRollMethod] = useState<string | null>(null);
    const [numUserChoices, setNumUserChoices] = useState(0);

    const rollMethods = [
        "Random",
        "Fast",
        "Major Hero",
        "Major Supporting Character",
        "Minor Hero",
        "Minor Supporting Character",
        "Average",
        "Manually Enter",
    ];

    function setStat(abbr: StatAbbr, val: number): void {
        char.stats.set(abbr, val);
        char.stats = char.stats;
        onCharChange(char);
    }

    function changeStat(abbr: StatAbbr, change: number) {
        const currentVal = getStatByAbbr(char.stats, abbr);

        const newVal = currentVal + change;
        if (newVal > -1 && newVal < 11) {
            setStat(abbr, newVal);
            setNumUserChoices(numUserChoices - change);
        }
    }

    function moveStat(abbr: StatAbbr, direction: number) {
        const statsKeyVal = Array.from(char.stats);
        // get current index
        const index = statsKeyVal.map(([key, _]) => key).indexOf(abbr);
        const newIndex = index + direction;
        const newAbbr = statsKeyVal.map(([key, _]) => key)[newIndex];

        // check if we can move in given direction
        if (newIndex > -1 && newIndex < statsKeyVal.length) {
            // perform swap
            const indexVal = statsKeyVal[index][1];
            const newIndexVal = statsKeyVal[newIndex][1];
            char.stats.set(newAbbr, indexVal);
            char.stats.set(abbr, newIndexVal);
        }
        char.stats = char.stats;
        onCharChange(char);
    }

    function chooseRollMethod(method: string | null) {
        setRollMethod(method);
        char.stats = genCleanStats();
        onCharChange(char);
        setNumUserChoices(0);

        if (method === "Random" || method === "Fast") {
            setNumUserChoices(0);
            for (const key of Array.from(char.stats.keys())) {
                const roll = rollD8() + 2;
                char.stats.set(key, roll);
            }
            char.stats = char.stats;
            onCharChange(char);
        } else if (method === "Major Hero") {
            setNumUserChoices(80);
        } else if (method === "Major Supporting Character") {
            setNumUserChoices(70);
        } else if (method === "Minor Hero") {
            setNumUserChoices(75);
        } else if (method === "Minor Supporting Character") {
            setNumUserChoices(60);
        } else if (method === "Average") {
            setNumUserChoices(50);
        } else if (method === "Manually Enter") {
            setNumUserChoices(1000);
        }
    }

    return (
        <div className="section">
            <h2
                className={
                    !Array.from(char.stats.values()).some((val) => val < 3)
                        ? "sectFinished"
                        : "sectNotFinished"
                }
            >
                2. Statistics:
            </h2>
            <p>
                Each character has nine Statistics -- values representing the
                level of native ability of the character in specific areas of
                activity.
            </p>
            <div id="rolling">
                {!rollMethod ? (
                    <span>
                        <label>Choose Roll Method:</label>
                        <br />
                        <br />
                        {rollMethods.map((method, index) => (
                            <span key={index}>
                                <button
                                    onClick={() => chooseRollMethod(method)}
                                >
                                    {method}
                                </button>
                                <br />
                            </span>
                        ))}
                    </span>
                ) : (
                    <span>
                        Roll Method: {rollMethod} &nbsp;
                        <button onClick={() => chooseRollMethod(null)}>
                            Change
                        </button>
                        <br />
                        <p>
                            {rollDescr.get(rollMethod)} <br />
                            {rollMethod !== "Fast" &&
                            rollMethod !== "Random" &&
                            rollMethod !== "Manually Enter"
                                ? `${numUserChoices} remaining to spend`
                                : ``}
                            {rollMethod === "Manually Enter"
                                ? `${1000 - numUserChoices} points used`
                                : ``}
                        </p>
                        <StatTable
                            lines={Array.from(char.stats).map(
                                ([abbr, val]) => ({
                                    id: abbr,
                                    name: `${getFullStatName.get(
                                        abbr
                                    )} (${abbr})`,
                                    value: val,
                                })
                            )}
                            mode={
                                rollMethod !== "Fast"
                                    ? numUserChoices > 0
                                        ? "edit"
                                        : "none"
                                    : "move"
                            }
                            onDown={(id) =>
                                rollMethod === "Fast"
                                    ? moveStat(id as StatAbbr, +1)
                                    : changeStat(id as StatAbbr, -1)
                            }
                            onUp={(id) =>
                                rollMethod === "Fast"
                                    ? moveStat(id as StatAbbr, -1)
                                    : changeStat(id as StatAbbr, +1)
                            }
                        />
                    </span>
                )}
            </div>
            <div id="calcStats">
                <h4>Derived Stats</h4>
                <div className="stat">Run [{char.run || " "}]</div>
                <div className="stat">Leap [{char.leap || " "}]</div>
                <div className="stat">Lift [{char.lift || " "}]</div>
                <div className="stat">Carry [{char.carry || " "}]</div>
                <div className="stat">Body Type [{char.bodyType || " "}]</div>
                <div className="stat">
                    Body Type Modifier [{char.bodyTypeModifier || " "}]
                </div>
                <div className="stat">Save [{char.save || " "}]</div>
                <div className="stat">Humanity [ / {char.humanityMax}]</div>
                <br />
            </div>
        </div>
    );
}

export default CharStats;
