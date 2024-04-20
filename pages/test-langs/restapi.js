
// DON'T FORGET THIS 
const fetch = require('node-fetch');

/*
 * Complete the 'getTotalGoals' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. STRING team
 *  2. INTEGER year
 */




async function getTotalGoals(team, year) {

    const response = await fetch(`https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team1=Chelsea`);
   const json = await response.json()

   let total_goals_home = 0
   let total_goals_away = 0
   
   for (let i = 1; i <= json.total_pages; i++) {
       const response = await fetch(`https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team1=${team}&page=${i}`)
           const resp = await response.json()
           for (let j = 0; j < resp.data.length; j++) {
               total_goals_home += parseInt(resp.data[j].team1goals)
           }
       
   }
   for (let i = 1; i <= json.total_pages; i++) {
       const response = await fetch(`https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team2=${team}&page=${i}`)
           const resp = await response.json()
           for (let j = 0; j < resp.data.length; j++) {
               total_goals_away += parseInt(resp.data[j].team2goals)
           }
       
   }
   let total_goals = total_goals_home + total_goals_away
   console.log(total_goals)
   return total_goals
     

}

/**
 * 
 * Sample Json:
 * 
 * {
"page": 1,
"per_page": 10,
"total": 162,
"total_pages": 17,
"data": [
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "GroupE",
"team1": "KRC Genk",
"team2": "Valencia CF",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "GroupD",
"team1": "AFC Ajax",
"team2": "Olympique Lyon",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "GroupF",
"team1": "Arsenal",
"team2": "Olympique Marseille",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "GroupB",
"team1": "Trabzonspor",
"team2": "CSKA Moskva",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "GroupD",
"team1": "Olympique Lyon",
"team2": "AFC Ajax",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "GroupG",
"team1": "Zenit St. Petersburg",
"team2": "APOEL Nikosia",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "GroupG",
"team1": "FC Porto",
"team2": "Zenit St. Petersburg",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "GroupB",
"team1": "Lille OSC",
"team2": "Trabzonspor",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "UEFA Champions League",
"year": 2011,
"round": "QF",
"team1": "AC Milan",
"team2": "Barcelona",
"team1goals": "0",
"team2goals": "0"
},
{
"competition": "English Premier League",
"year": 2011,
"round": "",
"team1": "Arsenal",
"team2": "Chelsea",
"team1goals": "0",
"team2goals": "0"
}
]
}
 */

async function getNumDraws(year) {
    let draws = 0;
    let currentPage = 1;
    let totalPages = 1;

    // Fetch the first page of data
    const response = await fetch(`https://jsonmock.hackerrank.com/api/football_matches?year=${year}`);
    const json = await response.json();

    // Get total pages from the first request
    totalPages = json.total_pages;

    // Process the first page
    draws += json.data.filter(match => match.team1goals === match.team2goals).length;

    // Fetch and process subsequent pages in parallel
    const fetchPromises = [];
    for (let i = 2; i <= totalPages; i++) {
        fetchPromises.push(fetch(`https://jsonmock.hackerrank.com/api/football_matches?year=${year}&page=${i}`)
            .then(response => response.json())
            .then(data => {
                draws += data.data.filter(match => match.team1goals === match.team2goals).length;
            }));
    }

    // Wait for all requests to complete
    await Promise.all(fetchPromises);

    return draws;
}
