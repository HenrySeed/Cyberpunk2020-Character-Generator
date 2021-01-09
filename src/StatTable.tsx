import React from "react";
import "./statTable.css";

interface TableProps {
    lines: { id: string; name: string; value: number }[];
    mode: "none" | "move" | "edit";
    onUp?: (id: string) => void;
    onDown?: (id: string) => void;
    onBigUp?: (id: string) => void;
    onBigDown?: (id: string) => void;
}

function StatTable({
    lines,
    mode,
    onDown,
    onUp,
    onBigUp,
    onBigDown,
}: TableProps) {
    return (
        <div>
            <table className="statTable">
                <tbody>
                    {lines.map(({ id, name, value }, index) => (
                        <tr key={index}>
                            <td className="statname">{name}</td>
                            <td>
                                {mode !== "none" && onDown ? (
                                    <button
                                        className="statButton"
                                        onClick={() => onDown(id)}
                                    >
                                        {mode === "edit" ? "-" : "˅"}
                                    </button>
                                ) : (
                                    <span></span>
                                )}
                                {onBigDown && mode === "edit" ? (
                                    <button
                                        className="statButton"
                                        onClick={() => onBigDown(id)}
                                    >
                                        {"−-"}
                                    </button>
                                ) : (
                                    <span></span>
                                )}
                                <span className="statBrackets">
                                    [
                                    <span className="statIndicatorNumber">
                                        {value}
                                    </span>
                                    ]
                                </span>
                                {onBigUp && mode === "edit" ? (
                                    <button
                                        className="statButton"
                                        onClick={() => onBigUp(id)}
                                    >
                                        ++
                                    </button>
                                ) : (
                                    <span></span>
                                )}
                                {mode !== "none" && onUp ? (
                                    <button
                                        className="statButton"
                                        onClick={() => onUp(id)}
                                    >
                                        {mode === "edit" ? "+" : "˄"}
                                    </button>
                                ) : (
                                    <span></span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StatTable;
