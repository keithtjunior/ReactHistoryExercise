import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ sortedJokes }) => {
    const [jokes, setJokes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const numJokesToGetRef = useRef(5);

    useEffect(() => {
        getJokes();
    }, []);

    /* retrieve jokes from API */
    const getJokes = async () => {
        try {
            // load jokes one at a time, adding not-yet-seen jokes  
            let seenJokes = new Set(); 
            let jokesArr = [];

            while (jokesArr.length < numJokesToGetRef.current) {
                let res = await axios.get("https://icanhazdadjoke.com", {
                headers: { Accept: "application/json" }
                });
                let { ...joke } = res.data;

                if (!seenJokes.has(joke.id)) {
                    seenJokes.add(joke.id);
                    jokesArr.push({ ...joke, votes: 0 })
                } else {
                    console.log("duplicate found!");
                }
            }
            setJokes(jokesArr);
            setIsLoading(false);
        } catch (err) {
            console.error(err);
        }
    }

    /* set to loading state, and then call getJokes */
    const generateNewJokes = async () => {
        setIsLoading(true);
        await getJokes();
    }

    /* change vote for this id by delta (+1 or -1) */
    const vote = (id, delta) => {
        setJokes(st => st.map(j =>
                j.id === id ? { ...j, votes: j.votes + delta } : j
            )
        );
    }

    sortedJokes = jokes.sort((a, b) => b.votes - a.votes);
    if (isLoading)
        return (
            <div className="loading">
                <i className="fas fa-4x fa-spinner fa-spin" />
            </div>
        )
    else
        return (
            <div className="JokeList">
                <button
                    className="JokeList-getmore"
                    onClick={generateNewJokes}
                >
                    Get New Jokes
                </button>

                {sortedJokes.map(j => (
                    <Joke
                        text={j.joke}
                        key={j.id}
                        id={j.id}
                        votes={j.votes}
                        vote={vote}
                    />
                ))}
            </div>
        )
}
JokeList.defaultProps = {
    sortedJokes: []
};

export default JokeList;