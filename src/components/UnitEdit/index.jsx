
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

import selectize from '../../utils/selectize';
import PaperPlaneIcon from '../../assets/svgs/paper-plane.svg';
import './style.scss';

class UnitEdit extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      submitted: null,
      error: null,
      submitting: false,
      office: '',
      area: '',
      type: '',
      status: '',
      category: '',
      coolingCapacity: '',
      capacityRating: '',
      energyEfficiencyRatio: '',
      purchaseYear: '',
      hoursPerDay: '',
      daysPerWeek: '',
      added: null,
      addingError: null,
      adding: false,
      operation: '',
      'date-start': '',
      'date-end': '',
      description: ''
    };

    this.handleInput = this.handleInput.bind(this);
    this.editUnit = this.editUnit.bind(this);
    this.submitOperation = this.submitOperation.bind(this);
  }

  async componentDidMount () {
    const unitId = this.props.params.id;
    const officesRes = await axios.get('/api/offices');
    if (!officesRes.data.success) {
      this.setState({ error: officesRes.data.message });
      return;
    }

    const unitRes = await axios.get(`/api/units/unit/${unitId}`);
    if (!unitRes.data.success) {
      this.setState({ error: unitRes.data.message });
      return;
    }

    selectize('#unit-edit-office', officesRes.data.offices.map(office => {
      return {
        text: office.name,
        value: office.id,
        disabled: false,
        $order: office.id
      }
    }), this);


    const unit = unitRes.data.unit;
    const editOffice = document.querySelector('#unit-edit-office');
    editOffice.selectize.setValue(unit.office_id);

    this.setState({
      office: unit.office_id.toString(),
      area: unit.area,
      type: unit.type,
      status: unit.status,
      category: unit.category,
      coolingCapacity: unit.cooling_capacity || '',
      capacityRating: unit.capacity_rating || '',
      energyEfficiencyRatio: unit.energy_efficiency_ratio || '',
      purchaseYear: unit.purchase_year || '',
      hoursPerDay: unit.hours_per_day || '',
      daysPerWeek: unit.days_per_week || ''
    });
  }

  handleInput (event) {
    const state = this.state;
    const target = event.target;
    state[target.name] = target.value;
    this.setState({ state });
  }

  async editUnit (event) {
    event.preventDefault();

    const form = event.target;
    this.setState({
      error: null,
      submitted: null,
      submitting: true
    });

    const response = await axios.post(form.action, {
      office: this.state.office,
      area: this.state.area,
      type: this.state.type,
      status: this.state.status,
      category: this.state.category,
      coolingCapacity: this.state.coolingCapacity,
      capacityRating: this.state.capacityRating,
      energyEfficiencyRatio: this.state.energyEfficiencyRatio,
      purchaseYear: this.state.purchaseYear,
      hoursPerDay: this.state.hoursPerDay,
      daysPerWeek: this.state.daysPerWeek
    });

    const data = response.data;
    if (data.success) {
      this.setState({
        submitting: false,
        submitted: 'Unit was editted successfully'
      });
    } else {
      this.setState({
        submitting: false,
        error: data.message
      });
    }
  }

  async submitOperation (event) {
    event.preventDefault();

    const form = event.target;
    this.setState({
      addingError: null,
      added: null,
      adding: true
    });

    const response = await axios.post(form.action, {
      id: this.props.params.id,
      operation: this.state.operation,
      'date-start': this.state['date-start'],
      'date-end': this.state['date-end'],
      description: this.state.description
    });

    const data = response.data;
    if (data.success) {
      this.setState({
        adding: false,
        added: 'Operation was added successfully'
      });
    } else {
      this.setState({
        adding: false,
        addingError: data.message
      });
    }
  }

  render () {
    const unitId = this.props.params.id;
    const boxStatus = (this.state.error !== null && 'box-error') || (this.state.submitted !== null && 'box-success');
    const statusClass = `box ${boxStatus} mb-2 ` + (this.state.error !== null || this.state.submitted !== null ? 'd-block' : 'd-none');
    const addBoxStatus = (this.state.addingError !== null && 'box-error') || (this.state.added !== null && 'box-success');
    const addStatusClass = `box ${addBoxStatus} mb-2 ` + (this.state.addingError !== null || this.state.added !== null ? 'd-block' : 'd-none');

    return (
      <div className="d-flex d-lg-block p-4">
        <div id="form-units-edit">
          <div className="d-flex flex-space-between mb-2">
            <h3>Edit AC Unit ID: { unitId }</h3>
            <div>
              <NavLink to={`/unit/${unitId}`} className="btn mr-2" role="button">View</NavLink>
              <a href="#" className="btn btn-danger" role="button" onClick={window.close}>Close</a>
            </div>
          </div>

          <form action={`/api/units/unit/${unitId}`} method="put" className="box p-3" onSubmit={this.editUnit}>
            <div className="d-flex d-md-block">
              <div className="unit-details">
                <div className="form-group mb-2">
                  <label htmlFor="unit-edit-office">Office*:</label>
                  <select id="unit-edit-office" name="office" defaultValue="" required data-selectize></select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unit-edit-area">Area*:</label>
                  <input type="text" id="unit-edit-area" name="area" value={this.state.area} placeholder="Office Area" autoComplete="off" onChange={this.handleInput} required />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unit-edit-type">Type* (Window, Split, Package/Floor Type):</label>
                  <input type="text" id="unit-edit-type" name="type" value={this.state.type} placeholder="Window, Split, Package/Floor Type" autoComplete="off" onChange={this.handleInput} required />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unit-edit-status">Status* (Operational, Non-Operational, Stand-by):</label>
                  <input type="text" id="unit-edit-status" name="status" value={this.state.status} placeholder="Operational, Non-Operational, Stand-by" autoComplete="off" onChange={this.handleInput} required />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unit-edit-category">Category* (Inverter, Non-Inverter Type):</label>
                  <input type="text" id="unit-edit-category" name="category" value={this.state.category} placeholder="Inverter, Non-Inverter Type" autoComplete="off" onChange={this.handleInput} required />
                </div>
              </div>

              <div className="unit-rating">
                <div className="form-group mb-3">
                  <label htmlFor="unit-edit-cooling-capacity">Cooling Capacity (KJ/hr):</label>
                  <input type="text" id="unit-edit-cooling-capacity" name="coolingCapacity" value={this.state.coolingCapacity} placeholder="1 KJ/hr" autoComplete="off" onChange={this.handleInput} />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unit-edit-capacity-rating">Capacity Rating (HP or TR):</label>
                  <input type="text" id="unit-edit-capacity-rating" name="capacityRating" value={this.state.capacityRating} placeholder="HP or TR" autoComplete="off" onChange={this.handleInput} />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unit-edit-energy-efficiency-ratio">Energy Efficiency Ratio (EER):</label>
                  <input type="text" id="unit-edit-energy-efficiency-ratio" name="energyEfficiencyRatio" value={this.state.energyEfficiencyRatio} placeholder="EER" autoComplete="off" onChange={this.handleInput} />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="unit-edit-purchase-year">Year of Purchase:</label>
                  <input type="text" id="unit-edit-purchase-year" name="purchaseYear" value={this.state.purchaseYear} placeholder="2022" autoComplete="off" onChange={this.handleInput} />
                </div>

                <div className="d-flex mb-3">
                  <div className="form-group col-6 mr-2">
                    <label htmlFor="unit-edit-hours-per-day">Hours per day:</label>
                    <input type="number" id="unit-edit-hours-per-day" name="hoursPerDay" value={this.state.hoursPerDay} placeholder="8" autoComplete="off" onChange={this.handleInput} />
                  </div>

                  <div className="form-group col-6">
                    <label htmlFor="unit-edit-days-per-week">Days per week:</label>
                    <input type="number" id="unit-edit-days-per-week" name="daysPerWeek" value={this.state.daysPerWeek} placeholder="5" autoComplete="off" onChange={this.handleInput} />
                  </div>
                </div>
              </div>
            </div>

            <div className={statusClass}>{ this.state.error || this.state.submitted }</div>

            <div className="form-actions">
              <button type="submit" className="btn" disabled={this.state.submitting}>
                <PaperPlaneIcon width={17} height={16} fill="currentColor" className="fa mr-2" />
                { this.state.submitting ? 'Submitting' : 'Submit' }
              </button>
            </div>
          </form>
        </div>

        <form id="form-units-operation" action="/api/operations" method="post" className="box p-3" onSubmit={this.submitOperation}>
          <h3>Add Operation</h3>

          <div className="unit-rating">
            <div className="form-group mb-2">
              <label htmlFor="unit-addop-operation">Operation* (Clean and/or Repair):</label>
              <select id="unit-addop-operation" name="operation" defaultValue="" required onChange={this.handleInput}>
                <option value=""></option>
                <option value="1">Clean</option>
                <option value="2">Repair</option>
                <option value="3">Clean and Repair</option>
              </select>
            </div>

            <div className="form-group mb-2">
              <label htmlFor="unit-addop-date-start">Datetime Start*:</label>
              <input type="datetime-local" id="unit-addop-date-start" name="date-start" value={this.state['date-start']} required onChange={this.handleInput} />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="unit-addop-date-end">Datetime End*:</label>
              <input type="datetime-local" id="unit-addop-date-end" name="date-end" value={this.state['date-end']} required onChange={this.handleInput} />
            </div>

            <div className="form-group mb-2">
              <label htmlFor="unit-addop-description">Description:</label>
              <textarea id="unit-addop-description" name="description" rows="7" value={this.state.description} onChange={this.handleInput}></textarea>
            </div>
          </div>

          <div className={addStatusClass}>{ this.state.addingError || this.state.added }</div>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={this.state.adding}>
              <PaperPlaneIcon width={17} height={16} fill="currentColor" className="fa mr-2" />
              { this.state.adding ? 'Submitting' : 'Submit' }
            </button>
          </div>
        </form>
      </div>
    );
  }
}

UnitEdit.propTypes = {
  params: PropTypes.exact({
    id: PropTypes.number.isRequired
  })
};

export default function UnitEditWrapper () {
  const params = useParams();
  return <UnitEdit params={params} />;
}
