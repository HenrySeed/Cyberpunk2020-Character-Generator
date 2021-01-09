import React, { useEffect, useState } from "react";
import StatTable from "./StatTable";
import { career, Character, skillStatMap, statNames } from "./utils";
import "./App.css";

interface roleProps {
    char: Character;
    onCharChange: (prevChar: Character) => void;
}

function Skills({ char, onCharChange }: roleProps) {
    const [rolePointsLeft, setRolePointsLeft] = useState(0);
    const [pickupPointsLeft, setPickupPointsLeft] = useState(
        (char.stats.get("INT") || 0) + (char.stats.get("REF") || 0)
    );
    const [maxPickupStats, setMaxPickupStats] = useState(
        (char.stats.get("INT") || 0) + (char.stats.get("REF") || 0)
    );
    const [selectedStatList, setSelectedStatList] = useState("INT");

    const roleSkills = new Map(
        char.role
            ? career
                  .get(char.role)
                  ?.map((skill) => [skill, char.skills.get(skill) || 0]) || []
            : []
    );
    const allpickups = Array.from(skillStatMap.values())
        .flat()
        .filter((skill) => roleSkills.get(skill) === undefined);
    const pickupSkills = new Map(
        allpickups.map((skill) => [skill, char.skills.get(skill) || 0])
    );

    const [prevRole, setprevRole] = useState<string | null>();
    useEffect(() => {
        console.log(char.role, prevRole);
        if (char.role !== prevRole) {
            // reset all career skills
            char.skills = new Map();
            setRolePointsLeft(40);
        } else if (!char.role) {
            setRolePointsLeft(0);
        }

        setprevRole(char.role);

        const newPickupMax =
            (char.stats.get("INT") || 0) + (char.stats.get("REF") || 0);
        if (newPickupMax !== maxPickupStats) {
            setMaxPickupStats(newPickupMax);
            setPickupPointsLeft(newPickupMax);
        }
    }, [char, maxPickupStats]);

    function changeRoleSkill(name: string, change: number) {
        if (rolePointsLeft === 0 && change === +1) {
            return;
        }
        const newVal = (roleSkills?.get(name) || 0) + change;
        if (newVal >= 0 && newVal <= 10) {
            console.log(
                `Setting ${rolePointsLeft} to ${rolePointsLeft - change}`
            );
            setRolePointsLeft(rolePointsLeft - change);
            char.skills.set(name, (char.skills.get(name) || 0) + change);
            onCharChange(char);
        }
    }

    function changePickupSkill(name: string, change: number) {
        if (pickupPointsLeft === 0 && change === +1) {
            return;
        }
        const newVal = (pickupSkills?.get(name) || 0) + change;
        if (newVal >= 0 && (newVal <= 10 || change === -1)) {
            setPickupPointsLeft(pickupPointsLeft - change);
            char.skills?.set(name, (char.skills?.get(name) || 0) + change);
            onCharChange(char);
        }
    }

    const pickupStatCategories = statNames.filter(
        (name) => name.abbr !== "LUCK" && name.abbr !== "MA"
    );

    const currentSkills = Array.from(pickupSkills)
        .filter(([key, val]) => val > 0)
        .map(([key, val]) => ({
            id: key,
            name: key,
            value: val,
        }));

    const currentPickUpList = Array.from(pickupSkills).filter((val) =>
        skillStatMap.get(selectedStatList)?.includes(val[0])
    );

    return (
        <div className="section">
            <h2
                className={
                    rolePointsLeft === 0 && pickupPointsLeft === 0 && char.role
                        ? "sectFinished"
                        : "sectNotFinished"
                }
            >
                3. Skills:
            </h2>
            <p>
                Your Character has two types of skills, <em>Career Skills</em>{" "}
                and <em>Pickup Skills</em>.
            </p>
            <p>
                <em>Career skills</em> are skills your character learnt as part
                of his or her Career. They're basics- Rockers know how to play
                instruments, Solos know how to shoot guns, etc.{" "}
            </p>
            <p>
                <em>Pickup Skills</em> are skills the character has learned in
                the course of knocking around, living his or her life
            </p>
            {char.role && char.stats.get("INT") !== null ? (
                <div id="skillsColumns">
                    <div className="col1">
                        <h3
                            className={
                                rolePointsLeft === 0
                                    ? "sectFinished"
                                    : "sectNotFinished"
                            }
                        >
                            Career Skills
                        </h3>
                        {rolePointsLeft} points remaining to spend
                        <StatTable
                            lines={Array.from(roleSkills || []).map(
                                ([key, val]) => ({
                                    id: key,
                                    name: key,
                                    value: val,
                                })
                            )}
                            mode="edit"
                            onDown={(id) => changeRoleSkill(id, -1)}
                            onUp={(id) => changeRoleSkill(id, +1)}
                        />
                    </div>
                    <div className="col2">
                        <h3
                            className={
                                pickupPointsLeft === 0
                                    ? "sectFinished"
                                    : "sectNotFinished"
                            }
                        >
                            Pickup Skills
                        </h3>
                        <p>{pickupPointsLeft} points remaining to spend</p>
                        <div className="pickupContainer">
                            {/* {currentSkills.length > 0 ? (
                                <span>
                                    <StatTable
                                        lines={currentSkills}
                                        mode="edit"
                                        onDown={(id) =>
                                            changePickupSkill(id, -1)
                                        }
                                        onUp={(id) => changePickupSkill(id, +1)}
                                    />
                                </span>
                            ) : (
                                ""
                            )} */}
                            <div className="statCategories">
                                {pickupStatCategories.map((val, index) => (
                                    <button
                                        key={index}
                                        style={{ marginRight: "10px" }}
                                        onClick={() =>
                                            setSelectedStatList(val.abbr)
                                        }
                                        className={
                                            selectedStatList === val.abbr
                                                ? ""
                                                : "buttonFull"
                                        }
                                    >
                                        {val.abbr}
                                    </button>
                                ))}
                            </div>

                            <span className="newSkillList">
                                <StatTable
                                    lines={currentPickUpList.map(
                                        ([key, val]) => ({
                                            id: key,
                                            name: key,
                                            value: val,
                                        })
                                    )}
                                    mode="edit"
                                    onDown={(id) => changePickupSkill(id, -1)}
                                    onUp={(id) => changePickupSkill(id, +1)}
                                />
                            </span>
                            <div className="pickupScroll">
                                {currentPickUpList.length >= 8
                                    ? "--------------v--------------"
                                    : ""}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <span>
                    <br />
                    <em>
                        Choose a Role and allocate your stats before you choose
                        your skills
                    </em>
                </span>
            )}
        </div>
    );
}

export default Skills;
