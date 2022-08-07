
import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import Pagination from '../Pagination';
import selectize from '../../utils/selectize';

import MagnifyingGlassIcon from '../../assets/svgs/magnifying-glass.svg';
import PenIcon from '../../assets/svgs/pen.svg';
import './style.scss';

class SearchForm extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      error: null,
      searching: false,
      office: '',
      area: '',
      type: '',
      status: '',
      category: '',
      results: [],
      pagination: {
        key: 0,
        page: 0,
        total: 0
      }
    };

    this.limit = 8;
    this.handleSearch = this.handleSearch.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  async componentDidMount () {
    const officesRes = await axios.get('/api/offices');
    const filtersRes = await axios.get('/api/units/filters');

    if (!officesRes.data.success) {
      this.setState({ error: officesRes.data.message });
      return;
    }

    if (!filtersRes.data.success) {
      this.setState({ error: filtersRes.data.message });
      return;
    }

    const filtersData = filtersRes.data;
    const types = filtersData.types.map((type, i) => {
      return {
        text: type,
        value: type,
        disabled: false,
        $order: i
      };
    });

    const statuses = filtersData.statuses.map((status, i) => {
      return {
        text: status,
        value: status,
        disabled: false,
        $order: i
      }
    });

    const categories = filtersData.categories.map((category, i) => {
      return {
        text: category,
        value: category,
        disabled: false,
        $order: i
      };
    })

    selectize('#search-office', officesRes.data.offices.map(office => {
      return {
        text: office.name,
        value: office.id,
        disabled: false,
        $order: office.id
      }
    }), this);

    selectize('#search-type', types, this);
    selectize('#search-status', statuses, this);
    selectize('#search-category', categories, this);
  }

  async handleSearch (event) {
    event.preventDefault();

    const form = event.target;
    this.setState({
      error: null,
      searching: true
    });

    const query = new URLSearchParams();
    query.set('office', this.state.office);
    query.set('area', this.state.area);
    query.set('type', this.state.type);
    query.set('status', this.state.status);
    query.set('category', this.state.category);

    const response = await axios.get(`${form.action}?${query.toString()}`);
    const data = response.data;
    if (data.success) {
      this.setState({
        searching: false,
        results: data.results,
        pagination: {
          key: this.state.pagination.key + 1,
          page: 0,
          total: Math.ceil(data.results.length / this.limit)
        }
      });
    } else {
      this.setState({
        searching: false,
        error: data.message
      });
    }
  }

  handleInput (event) {
    const target = event.target;
    const state = this.state;
    state[target.name] = target.value;
    this.setState(state);
  }

  resetForm (event) {
    event.preventDefault();

    const elems = document.querySelectorAll('[data-selectize]');
    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i];
      elem.selectize.clear();
    }
  }

  changePage (page) {
    const state = this.state;
    state.pagination.page = page;
    this.setState(state);
  }

  render () {
    const results = [];
    const page = this.state.pagination.page;
    const totalPages = this.state.pagination.total;
    const pageKey = this.state.pagination.key;
    const pagination = <Pagination active={page} pages={totalPages} onChange={this.changePage} key={pageKey} />;
    const limit = this.limit;
    const offset = page * limit;

    for (let i = offset; i < this.state.results.length && (i - offset) < limit; i++) {
      const unit = this.state.results[i];
      if (typeof unit === 'undefined') break;

      results.push(
        <div className="details-container box m-3" key={i}>
          <div className="details-group">
            <span className="details-header">ID:</span>
            <span className="details-value">{ unit.id }</span>
          </div>

          <div className="details-group">
            <span className="details-header">Office:</span>
            <span className="details-value">{ unit.office_name }</span>
          </div>

          <div className="details-group">
            <span className="details-header">Area:</span>
            <span className="details-value">{ unit.area }</span>
          </div>

          <div className="details-group">
            <span className="details-header">Type:</span>
            <span className="details-value">{ unit.type }</span>
          </div>

          <div className="details-group">
            <span className="details-header">Status:</span>
            <span className="details-value">{ unit.status }</span>
          </div>

          <div className="details-group">
            <span className="details-header">Category:</span>
            <span className="details-value">{ unit.category }</span>
          </div>

          <div className="flex-1"></div>
          <div className="mt-2">
            <NavLink to={`/unit/${unit.id}`} target="_blank" className="btn mr-2" role="button">View</NavLink>
            <NavLink to={`/unit/${unit.id}/edit`} target="_blank" className="btn btn-light" role="button">
              <PenIcon width={17} height={17} fill="currentColor" className="fa mr-1" /> Edit
            </NavLink>
          </div>
        </div>
      );
    }

    const statusClass = 'box mb-2' + (this.state.error !== null ? ' box-error d-block' : ' d-none');
    return (
      <div className="d-flex flex-baseline d-lg-block p-4">
        <form action="/api/search" method="get" className="search-form box p-4" onSubmit={this.handleSearch}>
          <h4>Filter AC Units</h4>
          <div className="form-group mb-2">
            <label htmlFor="search-office">Office Name:</label>
            <select id="search-office" name="office" defaultValue="" data-selectize></select>
          </div>

          <div className="form-group mb-2">
            <label htmlFor="search-area">Area:</label>
            <input type="text" id="search-area" name="area" value={this.state.area} autoComplete="off" onChange={this.handleInput} />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="search-type">Type:</label>
            <select id="search-type" name="type" defaultValue="" data-selectize></select>
          </div>

          <div className="form-group mb-2">
            <label htmlFor="search-status">Status:</label>
            <select id="search-status" name="status" defaultValue="" data-selectize></select>
          </div>

          <div className="form-group mb-2">
            <label htmlFor="search-category">Category:</label>
            <select id="search-category" name="category" defaultValue="" data-selectize></select>
          </div>

          <div className={statusClass}>{ this.state.error }</div>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={this.state.searching}>
              <MagnifyingGlassIcon width={17} height={17} fill="currentColor" className="fa mr-2" />
              { this.state.searching ? 'Searching...' : 'Search' }
            </button>

            <button type="reset" className="btn btn-light" onClick={this.resetForm}>Reset</button>
          </div>
        </form>

        <div className="d-flex flex-column flex-1 align-self-start mx-3">
          <div className="mb-2 mx-1">
            <h3>Search Results</h3>
            <p>
              { this.state.results.length > 0 ? this.state.results.length + ' result(s)' : '' }
              { this.state.results.length > 0 ? `: Showing page ${page + 1} of ${totalPages}` : '' }
            </p>
          </div>

          <nav className="align-self-center">
            { this.state.results.length > 0 && pagination }
          </nav>

          <div className="d-flex flex-wrap align-items-stretch my-2">
            { results.length > 0 ? results : 'No results.' }
          </div>
        </div>
      </div>
    );
  }
}

export default SearchForm;
