import React from "react";
import "./App.css";
import { RouteComponentProps } from "react-router-dom";
import StatTable from "./StatTable";
import { Appearance, career, Character, Enemy, getFullStatName } from "./utils";
import { plainToClass } from "class-transformer";

function CharSheet(props: RouteComponentProps) {
    let char: Character;
    let roleSkills: [string, number][];
    let pickupSkills: [string, number][];

    try {
        char = plainToClass(
            Character,
            JSON.parse(atob(props.location.search.replace("?char=", "")))
        );
        roleSkills = Array.from(char.skills).filter(([name, val]) =>
            career.get(char.role || "cop")?.includes(name)
        );
        pickupSkills = Array.from(char.skills).filter(
            ([name, val]) => !career.get(char.role || "cop")?.includes(name)
        );
    } catch {
        return (
            <div className="App">
                The character is corrupted or missing. make sure you have the
                right url
            </div>
        );
    }

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

    console.log(char);
    return (
        <div className="App">
            <div>
                <label>Handle</label> {char.handle}
            </div>
            <div>
                <label>Role</label> {char.role}
            </div>
            <br />
            <div>
                <table className="borderTable saveTable">
                    <tbody>
                        <tr>
                            <th>INT</th>
                            <th>REF</th>
                            <th>TECH</th>
                            <th>COOL</th>
                            <th>ATT</th>
                            <th>LUCK</th>
                            <th>MA</th>
                            <th>BODY</th>
                            <th>EMP</th>
                            <th>SAVE</th>
                            <th>BTM</th>
                        </tr>
                        <tr>
                            <th>{char.stats.get("INT")}</th>
                            <th>{char.stats.get("REF")}</th>
                            <th>{char.stats.get("TECH")}</th>
                            <th>{char.stats.get("COOL")}</th>
                            <th>{char.stats.get("ATT")}</th>
                            <th>{char.stats.get("LUCK")}</th>
                            <th>{char.stats.get("MA")}</th>
                            <th>{char.stats.get("BODY")}</th>
                            <th>{char.stats.get("EMP")}</th>
                            <td>{char.save}</td>
                            <td>{char.bodyTypeModifier}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br />

            <div>
                <div className="stat inlineStat">Run [{char.run || " "}]</div>
                <div className="stat inlineStat">Leap [{char.leap || " "}]</div>
                <div className="stat inlineStat">Lift [{char.lift || " "}]</div>
                <div className="stat inlineStat">
                    Carry [{char.carry || " "}]
                </div>
                <div className="stat inlineStat">
                    Body Type [{char.bodyType || " "}]
                </div>
                <div className="stat inlineStat">
                    Body Type Modifier [{char.bodyTypeModifier || " "}]
                </div>
                <div className="stat inlineStat">Save [{char.save || " "}]</div>
                <div className="stat inlineStat">
                    Humanity [ / {char.humanityMax}]
                </div>
            </div>

            <br />
            <br />
            <div className="col1">
                <h2>Career Skills</h2>
                <StatTable
                    lines={roleSkills.map(([key, val]) => ({
                        id: key,
                        name: key,
                        value: val,
                    }))}
                    mode="none"
                />
            </div>
            <div className="col2">
                <h2>Pickup Skills</h2>
                <StatTable
                    lines={pickupSkills.map(([key, val]) => ({
                        id: key,
                        name: key,
                        value: val,
                    }))}
                    mode="none"
                />
            </div>
            <div>
                <h3 className={char.style ? "sectFinished" : "sectNotFinished"}>
                    Style and Clothing
                </h3>
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
            <div>
                <h3>Ethnicity and Language</h3>
                <div>Ethnicity:&nbsp;{char.ethnicity}</div>
                <div>Language:&nbsp;{char.language}</div>
            </div>
            <div>
                <h3>Family Background</h3>
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
            <div>
                <h3>Motivation</h3>
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
            <div>
                <h3>Life Events</h3>
                <StatTable
                    lines={[{ name: "Age", id: "Age", value: char.age }]}
                    mode="none"
                />
                <br />
                <table className="lifeList">
                    <tbody>{lifeTable}</tbody>
                </table>
            </div>
        </div>
    );
}

export default CharSheet;
