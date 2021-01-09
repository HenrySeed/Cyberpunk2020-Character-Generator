import React from "react";
import {
    affectations,
    Character,
    clothes,
    ethnicities,
    hairStyle,
    rollD10,
    Appearance,
    Enemy,
} from "./utils";
import "./App.css";
import { familyBackground, lifeEvents, motivation } from "./BackStoryGenerator";
import StatTable from "./StatTable";
import { isArray } from "util";

interface BackstoryProps {
    char: Character;
    onCharChange: (prevChar: Character) => void;
}

function Backstory({ char, onCharChange }: BackstoryProps) {
    function rollStyle() {
        const clothesChoice = Object.values(clothes)[rollD10() - 1];
        const hairChoice = Object.values(hairStyle)[rollD10() - 1];
        const affectationsChoice = Object.values(affectations)[rollD10() - 1];
        char.style = {
            clothes: clothesChoice,
            hair: hairChoice,
            affectation: affectationsChoice,
        };
        onCharChange(char);
    }

    function changeAge(change: number) {
        const newAge = char.age + change;
        if (newAge > 16 && newAge < 100) {
            char.age = newAge;
            onCharChange(char);
        }
    }

    function rollEthnicity() {
        char.ethnicity = ethnicities[rollD10() - 1].origin;
        char.language = null;
        onCharChange(char);
    }
    function rollFamilyBackground() {
        char.familyBackground = familyBackground();
        onCharChange(char);
    }
    function rollMotivation() {
        char.motivation = motivation();
        onCharChange(char);
    }
    function rollLifeEvents() {
        char.lifeEvents = lifeEvents(char.age);
        onCharChange(char);
    }

    const ethLanguages = ethnicities.find(
        (val) => val.origin === char.ethnicity
    )?.languages;

    // compile the life table
    const lifeTable: JSX.Element[] = [];
    let i = 0;
    for (const event of char.lifeEvents || []) {
        let contents: JSX.Element[] = [];
        if (Array.isArray(event)) {
            event.forEach((col, index) => {
                if ((col as Appearance).hair) {
                    contents.push(
                        <td key={index}>
                            {Object.values(col).map((app, i) => (
                                <li key={i}>{app}</li>
                            ))}
                        </td>
                    );
                } else if ((col as Enemy).cause) {
                    contents.push(
                        <table key={index}>
                            <tbody>
                                {Object.entries(col).map(([name, app], i) => (
                                    <tr key={i}>
                                        <td>{name}</td>
                                        <td>{app}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    );
                } else {
                    contents.push(<td key={index}>{col}</td>);
                }
            });
        } else {
            contents = [<td key="1">{event}</td>];
        }
        lifeTable.push(
            <tr key={i}>
                <td>{17 + i} </td>
                {contents}
            </tr>
        );
        i++;
    }

    return (
        <span id="backstorySection">
            <div className="section">
                <h2
                    className={
                        char.style &&
                        char.ethnicity &&
                        char.language &&
                        char.familyBackground &&
                        char.motivation
                            ? "sectFinished"
                            : "sectNotFinished"
                    }
                >
                    4. Backstory
                </h2>
                <h3 className={char.style ? "sectFinished" : "sectNotFinished"}>
                    Style and Clothing
                </h3>
                <button onClick={rollStyle}>Roll a new look</button>
                {char.style ? (
                    <span>
                        <p>Clothes: {char.style.clothes}</p>
                        <p>Hairstyle: {char.style.hair}</p>
                        <p>Affectations: {char.style.affectation}</p>
                    </span>
                ) : (
                    <span></span>
                )}
            </div>
            <div className="section">
                <h3
                    className={
                        char.ethnicity && char.language
                            ? "sectFinished"
                            : "sectNotFinished"
                    }
                >
                    Ethnicity and Language
                </h3>
                <button onClick={rollEthnicity}>Roll a new Ethnicity</button>
                <div className="col1">
                    <span> {char.ethnicity ? char.ethnicity : ""}</span>
                </div>
                <div className="col2">
                    {char.language ? (
                        <span>
                            {char.language}&nbsp;&nbsp;&nbsp;
                            <button
                                onClick={(e) => {
                                    char.language = null;
                                    onCharChange(char);
                                }}
                            >
                                Change Language
                            </button>
                        </span>
                    ) : char.ethnicity ? (
                        <span>
                            <label
                                style={{
                                    display: "inline-block",
                                }}
                                className={
                                    char.language
                                        ? "sectFinished"
                                        : "sectNotFinished"
                                }
                            >
                                Choose a Language
                            </label>
                            <br />
                            <br />
                            {ethLanguages?.map((val, i) => (
                                <button
                                    key={i}
                                    style={{ margin: "0 5px 5px 0" }}
                                    onClick={(e) => {
                                        char.language = val;
                                        onCharChange(char);
                                    }}
                                >
                                    {val}
                                </button>
                            ))}
                        </span>
                    ) : (
                        <span></span>
                    )}
                </div>
            </div>
            <div className="section">
                <h3
                    className={
                        char.familyBackground
                            ? "sectFinished"
                            : "sectNotFinished"
                    }
                >
                    Family Background
                </h3>
                <button onClick={rollFamilyBackground}>
                    Roll a new Family Background
                </button>
                <table className="familyList">
                    <tbody>
                        {char.familyBackground?.map(([key, val], i) => {
                            if (key !== "Siblings") {
                                return (
                                    <tr key={i}>
                                        <td>{key}: </td>
                                        <td>{val}</td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr style={{ marginTop: "10px" }} key={i}>
                                        <td>{key}: </td>
                                        <td>
                                            <ul>
                                                {(val as string[]).map(
                                                    (val, i) => (
                                                        <li key={i}>{val}</li>
                                                    )
                                                )}
                                            </ul>{" "}
                                        </td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
            </div>
            <div className="section">
                <h3
                    className={
                        char.motivation ? "sectFinished" : "sectNotFinished"
                    }
                >
                    Motivation
                </h3>
                <button onClick={rollMotivation}>Roll a new Motivation</button>
                <br /> <br />
                <table className="familyList">
                    <tbody>
                        {char.motivation?.map(([key, val], i) => {
                            return (
                                <tr key={i}>
                                    <td>{key}: </td>
                                    <td>{val}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="section">
                <h3
                    className={
                        char.lifeEvents ? "sectFinished" : "sectNotFinished"
                    }
                >
                    Life Events
                </h3>
                <StatTable
                    lines={[{ name: "Age", id: "Age", value: char.age }]}
                    onUp={() => changeAge(+1)}
                    onDown={() => changeAge(-1)}
                    onBigUp={() => changeAge(+10)}
                    onBigDown={() => changeAge(-10)}
                    mode="edit"
                />
                <br />
                <button onClick={rollLifeEvents}>Roll your Life Events</button>
                <br /> <br />
                <table className="lifeList">
                    <tbody>{lifeTable}</tbody>
                </table>
            </div>
        </span>
    );
}

export default Backstory;
