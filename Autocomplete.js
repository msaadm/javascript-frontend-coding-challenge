export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign(
      { numOfResults: 10, data: [], external: {} },
      options
    );
    Object.assign(this, { rootEl, options });

    this.init();
  }

  async getExternalData(url = "") {
    if (!url) {
      return [];
    }
    // Default options are marked with *
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(response);
    const result = await response.json();
    return result;
  }

  onQueryChange(query) {
    // Get data for the dropdown
    let results = [];
    // If Data is given
    if (this.options.data.length) {
      results = this.getResults(query, this.options.data);
      results = results.slice(0, this.options.numOfResults);
      this.updateDropdown(results);
    } else if (this.options.external.endpoint !== "") {
      if (query.length > 2) {
        let url =
          this.options.external.endpoint +
          "?" +
          this.options.external.search_var +
          "=" +
          encodeURIComponent(query);
        if (this.options.external.params) {
          url +=
            "&" + new URLSearchParams(this.options.external.params).toString();
        }
        this.getExternalData(url).then((resp) => {
          // console.log(resp)
          results = resp.items.map((item) => {
            console.log(item);
            return {
              text: item.login,
              value: item.login,
            };
          });
          // console.log(results);
          this.updateDropdown(results);
        });
      }
    }
    this.updateDropdown(results);
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    let results = data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    console.log(results);

    return results;
  }

  updateDropdown(results) {
    this.listEl.innerHTML = "";
    this.listEl.appendChild(this.createResultsEl(results));
  }

  selectValue(result) {
    this.inputEl.value = result;
    this.listEl.innerHTML = "";
  }

  toggleActiveClass(oldSelected) {
    if (oldSelected > -1) {
      this.listEl.children[oldSelected].classList.remove("active");
    }
    if (this.selected > -1) {
      this.listEl.children[this.selected].classList.add("active");
    }
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement("li");
      Object.assign(el, {
        className: this.rootEl.id + "_result",
        textContent: result.text,
      });

      // Pass the value to the onSelect callback
      el.addEventListener("click", (event) => {
        const { onSelect } = this.options;
        if (typeof onSelect === "function") onSelect(result.value);

        this.selectValue(result.text);
      });

      el.addEventListener("mouseover", (event) => {
        // Get Old Selected Item
        let oldSelected = this.selected;
        // Get the current li Index
        this.selected = Array.prototype.indexOf.call(
          this.listEl.childNodes,
          event.target
        );
        // Add Active Class on it
        this.toggleActiveClass(oldSelected);
      });

      fragment.appendChild(el);
    });

    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement("input");
    Object.assign(inputEl, {
      type: "search",
      name: this.rootEl.id + "_query",
      autocomplete: "off",
    });

    inputEl.addEventListener("input", (event) =>
      this.onQueryChange(event.target.value)
    );

    inputEl.addEventListener("keydown", (event) => {
      if (event.keyCode == 40) {
        // DOWN ARROW Key
        event.preventDefault();
        if (this.selected < this.listEl.children.length - 1) {
          this.toggleActiveClass(this.selected++);
          // console.log("Key Down", this.selected);
          this.listEl.children[this.selected].scrollIntoView(true);
        }
      } else if (event.keyCode == 38) {
        // UP ARRROW Key
        event.preventDefault();
        if (this.selected > -1) {
          this.toggleActiveClass(this.selected--);
          this.listEl.children[this.selected].scrollIntoView(true);
          // console.log("Key Up", this.selected);
        }
      } else if (event.keyCode == 13) {
        // ENTER Key
        event.preventDefault();
        // console.log("Enter", this.selected);
        if (this.selected > -1) {
          this.selectValue(this.listEl.children[this.selected].innerHTML);
        }
      }
    });

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl);
    this.selected = -1;

    // Build results dropdown
    this.listEl = document.createElement("ul");
    Object.assign(this.listEl, {
      className: this.rootEl.id + "_results autocomplete_results_ul",
    });
    this.rootEl.appendChild(this.listEl);
  }
}
