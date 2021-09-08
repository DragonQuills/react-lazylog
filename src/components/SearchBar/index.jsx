import { createRef, Component } from 'react';
import { bool, func, number } from 'prop-types';
import hotkeys from 'hotkeys-js';
import FilterLinesIcon from './FilterLinesIcon';
import { SEARCH_MIN_KEYWORDS } from '../../utils';
import {
  searchBar,
  searchInput,
  button,
  active,
  inactive,
} from './index.module.css';

export default class SearchBar extends Component {
  static propTypes = {
    /**
     * Executes a function when the user starts typing.
     */
    onSearch: func,
    /**
     * Executes a function when the search input has been cleared.
     */
    onClearSearch: func,
    /**
     * Executes a function when the option `Filter Lines With Matches`
     * is enable.
     */
    onFilterLinesWithMatches: func,
    /**
     * Number of search results. Should come from the component
     * executing the search algorithm.
     */
    resultsCount: number,
    /**
     * If true, then only lines that match the search term will be displayed.
     */
    filterActive: bool,
    /**
     * If true, the input field and filter button will be disabled.
     */
    disabled: bool,
    /**
     * If true, capture system hotkeys for searching the page (Cmd-F, Ctrl-F,
     * etc.)
     */
    captureHotkeys: bool,
    /**
     * Exectues a function when enter is pressed.
     * Defaults to turning the filter on and off.
     */
    onEnter: func,
  };

  static defaultProps = {
    onSearch: () => {},
    onClearSearch: () => {},
    onFilterLinesWithMatches: () => {},
    resultsCount: 0,
    filterActive: false,
    disabled: false,
    captureHotkeys: false,
  };

  state = {
    keywords: '',
  };

  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }

  handleFilterToggle = () => {
    this.props.onFilterLinesWithMatches(!this.props.filterActive);
  };

  handleSearchChange = e => {
    const { value: keywords } = e.target;

    this.setState({ keywords }, () => this.search());
  };

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      // this.handleFilterToggle();
      this.props.onEnter();
    } else if (this.props.captureHotkeys) {
      this.handleSearchHotkey(e);
    }
  };

  handleSearchHotkey = e => {
    if (!this.inputRef.current) {
      return;
    }

    e.preventDefault();
    this.inputRef.current.focus();
  };

  search = () => {
    const { keywords } = this.state;
    const { onSearch, onClearSearch } = this.props;

    if (keywords && keywords.length > SEARCH_MIN_KEYWORDS) {
      onSearch(keywords);
    } else {
      onClearSearch();
    }
  };

  componentDidMount() {
    if (this.props.captureHotkeys) {
      hotkeys('ctrl+f,cmd+f', this.handleSearchHotkey);
    }
  }

  render() {
    const { resultsCount, filterActive, disabled } = this.props;
    const matchesLabel = `match${resultsCount === 1 ? '' : 'es'}`;
    const filterIcon = filterActive ? active : inactive;

    return (
      <div className={`react-lazylog-searchbar ${searchBar}`}>
        <input
          autoComplete="off"
          type="text"
          name="search"
          placeholder="Search"
          className={`react-lazylog-searchbar-input ${searchInput}`}
          onChange={this.handleSearchChange}
          onKeyPress={this.handleKeyPress}
          value={this.state.keywords}
          disabled={disabled}
          ref={this.inputRef}
        />
        <button
          disabled={disabled}
          className={`react-lazylog-searchbar-filter ${
            filterActive ? 'active' : 'inactive'
          } ${button} ${filterIcon}`}
          onClick={this.handleFilterToggle}>
          <FilterLinesIcon />
        </button>
        <span
          className={`react-lazylog-searchbar-matches ${
            resultsCount ? 'active' : 'inactive'
          } ${resultsCount ? active : inactive}`}>
          {resultsCount} {matchesLabel}
        </span>
      </div>
    );
  }
}
