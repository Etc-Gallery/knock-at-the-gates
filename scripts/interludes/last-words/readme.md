# Last Words

## Steps to reproduce this data

1. Go to the Texas Department of Criminal Justice's homempage, (here)[http://www.tdcj.state.tx.us/death_row/dr_executed_offenders.html], to collect the data, and store it in a JSON object like (so)[https://github.com/Etc-Gallery/knock-at-the-gates/blob/master/data/interludes/last-words/raw/final-statements.json].

2. Take the data and scrub out as much of the unnecessary markup as you can from the Last Words. There are `<br>` tags left, right, and center--to say nothing of the `\n` and `\r` characters.

3. Join the statements together and perform a count of how many instances of each word appear across the joined statement, filtering out a (list of "stop words")[http://www.link-assistant.com/seo-stop-words.html]. We added "sorry" back in, even though it appears on this list.

4. Select statements that are representative for each word. You'll see ours, (here)[https://github.com/Etc-Gallery/knock-at-the-gates/blob/master/data/interludes/last-words/raw/chosen-words-and-statements.csv] and combine them with the counts.

## Scripts in this repo
Unfortunately, not all of the scripts that were used to create this dataset are in the repository; however, we encourage you to play with the data we assembled, (here)[https://github.com/Etc-Gallery/knock-at-the-gates/tree/master/data/interludes/last-words], and, if you are so inclined, try collecting the data from the TDCJ's page yourself.


