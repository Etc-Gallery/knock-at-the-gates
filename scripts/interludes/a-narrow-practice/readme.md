# A Narrow Practice

## Steps to reproduce this data

### FIPS County Codes

Go to the Census Bureau [here](http://www.census.gov/geo/reference/codes/files/national_county.txt) (You can replicate the steps I took to get them by going [here](http://www.census.gov/geo/reference/codes/cou.html).) and grab the codes.

Here is the format you'll get:

1. State
2. State ANSI
3. County ANSI
4. County Name
5. ANSI Cl

Note that for field 5:

> FIPS Class Codes
> H1:  identifies an active county or statistically equivalent entity that does not qualify under subclass C7 or H6.
> H4:  identifies a legally defined inactive or nonfunctioning county or statistically equivalent entity that does not qualify under subclass H6.
> H5:  identifies census areas in Alaska, a statistical county equivalent entity.
> H6:  identifies a county or statistically equivalent entity that is areally coextensive or governmentally consolidated with an incorporated place, part of an incorporated place, or a consolidated city. 
> C7:  identifies an incorporated place that is an independent city; that is, it also serves as a county equivalent because it is not part of any county, and a minor civil division (MCD) equivalent because it is not part of any MCD.

Note, also, that the "County Name" field includes, unfortunately, a trailing "county", meaning that in order to compare it to county names, you may need to scrub the name and do some processing.

### Map
You'll also need the us-10m.json map, graciously provided by Mike Bostock in his US Atlas project, here.

### DPIC data
You'll also need a csv file with the Death Penalty Information Center's dataset on modern executions, here.

### Combining them

- run `npm install shelljs`
- then run `node scripts/interludes/a-narrow-practice/build.js`
- that's really it.

Note that you'll need topojson and mapshaper installed. They're both found in NPM.

### Further notes
Check out the commented scripts included here to see how we did this.