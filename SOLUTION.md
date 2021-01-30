# Solution Docs

<!-- You can include documentation, additional setup instructions, notes etc. here -->

I added the dynamic class for each instance, so we can add multiple instances on same page.

1. To search from external APIs following parameters are required:  
   a. `endpoint`: Base URL for the Resource API.  
   b. `search_var`: Parameter name on which API results will be filtered, will be updated when we type into input field.  
   c. `params`: Object with key value pair for other parameters.  
   **Example**  
   `{`  
   &nbsp; &nbsp;`endpoint: "https://api.github.com/search/users",`  
   &nbsp; &nbsp;`search_var: "q",`  
   &nbsp; &nbsp;`params: {`  
   &nbsp; &nbsp; &nbsp; &nbsp;`per_page:10`  
   &nbsp; &nbsp;`}`  
   `}`

2. To Search in data array, pass an array with Text/Value pairs.

3. `MouseOver` and `Up/Down arrow key` will `active` and `li` item, and by `click` on it or `Enter Key` value will be selected.

Due to time limit I am not able to take it further...  
Otherwise we can provide more options to user like they can provide value and text attributes from API. Scrolling ul using key up/down can improve as well.
