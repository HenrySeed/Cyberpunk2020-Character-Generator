import { classToPlain } from "class-transformer";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Backstory from "./Backstory";
import CharacterStats from "./CharStats";
import Skills from "./Skills";
import { Character, Role, roles } from "./utils";

function CharEditor() {
    const [character, setCharacter] = useState(new Character());

    function chooseRole(role: Role | null) {
        character.role = role;
        setCharacter(character.clone());
    }
    function changeHandle(handle: string) {
        character.handle = handle;
        setCharacter(character.clone());
    }

    console.log(JSON.stringify(classToPlain(character)));

    return (
        <div className="App">
            <div className="section">
                <h2
                    className={
                        character.role && character.handle
                            ? "sectFinished"
                            : "sectNotFinished"
                    }
                >
                    1. Handle and Role
                </h2>
                Handle: &nbsp;
                <input
                    type="text"
                    id="handle"
                    name="handle"
                    onChange={(e) => changeHandle(e.target.value)}
                />
                <br />
                <br />
                {character.role ? (
                    <span>
                        Role: &nbsp; {character.role}
                        <button
                            style={{ marginLeft: "20px" }}
                            onClick={() => chooseRole(null)}
                        >
                            Change
                        </button>
                        &nbsp;( Resets your skills )
                    </span>
                ) : (
                    <span>
                        <label>Choose Role:</label>
                        <br />
                        <br />

                        {roles.map((role, index) => (
                            <span key={index}>
                                <button onClick={() => chooseRole(role)}>
                                    {role}
                                </button>
                                <br />
                            </span>
                        ))}
                    </span>
                )}
            </div>

            <CharacterStats
                char={character}
                onCharChange={(character: Character) =>
                    setCharacter(character.clone())
                }
            />
            <Skills
                char={character}
                onCharChange={(character: Character) =>
                    setCharacter(character.clone())
                }
            />
            <Backstory
                char={character}
                onCharChange={(character: Character) =>
                    setCharacter(character.clone())
                }
            />
            <div className="conclusion">
                <h2>Finished?</h2>
                <p>
                    This will take you to your character sheet, on a new page
                    unique to your character. You can bookmark it and return to
                    it any time.
                </p>
                <Link
                    to={`/character?char=${btoa(
                        JSON.stringify(classToPlain(character))
                    )}`}
                >
                    <button>Go To Character Sheet</button>
                </Link>
            </div>
        </div>
    );
}

export default CharEditor;
