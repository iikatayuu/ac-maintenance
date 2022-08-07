
import React from 'react';
import axios from 'axios';

import selectize from '../../utils/selectize';
import PaperPlaneIcon from '../../assets/svgs/paper-plane.svg';
import './style.scss';

class UnitAdd extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      added: null,
      error: null,
      submitting: false,
      office: '',
      area: '',
      type: '',
      status: '',
      category: '',
      quantity: 0,
      coolingCapacity: '',
      capacityRating: '',
      energyEfficiencyRatio: '',
      purchaseYear: '',
      hoursPerDay: '',
      daysPerWeek: ''
    };

    this.handleInput = this.handleInput.bind(this);
    this.submitUnit = this.submitUnit.bind(this);
  }

  async componentDidMount () {
    const officesRes = await axios.get('/api/offices');
    if (!officesRes.data.success) {
      this.setState({ error: officesRes.data.message });
      return;
    }

    selectize('#unit-add-office', officesRes.data.offices.map(office => {
      return {
        text: office.name,
        value: office.id,
        disabled: false,
        $order: office.id
      }
    }), this);
  }

  handleInput (event) {
    const state = this.state;
    const target = event.target;
    state[target.name] = target.value;
    this.setState({ state });
  }

  async submitUnit (event) {
    event.preventDefault();

    const form = event.target;
    this.setState({
      error: null,
      added: null,
      submitting: true
    });

    const response = await axios.post(form.action, {
      office: this.state.office,
      area: this.state.area,
      type: this.state.type,
      status: this.state.status,
      category: this.state.category,
      quantity: this.state.quantity,
      coolingCapacity: this.state.coolingCapacity,
      capacityRating: this.state.capacityRating,
      energyEfficiencyRatio: this.state.energyEfficiencyRatio,
      purchaseYear: this.state.purchaseYear,
      hoursPerDay: this.state.hoursPerDay,
      daysPerWeek: this.state.daysPerWeek
    });

    const data = response.data;
    if (data.success) {
      const elems = document.querySelectorAll('[data-selectize]');
      for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        elem.selectize.clear();
      }

      this.setState({
        submitting: false,
        added: 'Unit was successfully added',
        office: '',
        area: '',
        type: '',
        status: '',
        category: '',
        quantity: 0,
        coolingCapacity: '',
        capacityRating: '',
        energyEfficiencyRatio: '',
        purchaseYear: '',
        hoursPerDay: '',
        daysPerWeek: ''
      });
    } else {
      this.setState({
        submitting: false,
        error: data.message
      });
    }
  }

  render () {
    const boxStatus = (this.state.error !== null && 'box-error') || (this.state.added !== null && 'box-success');
    const statusClass = `box ${boxStatus} mb-2 ` + (this.state.error !== null || this.state.added !== null ? 'd-block' : 'd-none');

    return (
      <form id="form-units-add" action="/api/units" method="post" className="box mt-4 mx-auto p-3" onSubmit={this.submitUnit}>
        <h3>Add AC Unit</h3>

        <div className="d-flex d-md-block">
          <div className="unit-details">
            <div className="form-group mb-2">
              <label htmlFor="unit-add-office">Office*:</label>
              <select id="unit-add-office" name="office" defaultValue="" required data-selectize></select>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="unit-add-area">Area*:</label>
              <input type="text" id="unit-add-area" name="area" value={this.state.area} placeholder="Office Area" autoComplete="off" onChange={this.handleInput} required />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="unit-add-type">Type* (Window, Split, Package/Floor Type):</label>
              <input type="text" id="unit-add-type" name="type" value={this.state.type} placeholder="Window, Split, Package/Floor Type" autoComplete="off" onChange={this.handleInput} required />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="unit-add-status">Status* (Operational, Non-Operational, Stand-by):</label>
              <input type="text" id="unit-add-status" name="status" value={this.state.status} placeholder="Operational, Non-Operational, Stand-by" autoComplete="off" onChange={this.handleInput} required />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="unit-add-category">Category* (Inverter, Non-Inverter Type):</label>
              <input type="text" id="unit-add-category" name="category" value={this.state.category} placeholder="Inverter, Non-Inverter Type" autoComplete="off" onChange={this.handleInput} required />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="unit-add-quantity">Quantity*:</label>
              <input type="number" id="unit-add-quantity" name="quantity" value={this.state.quantity} placeholder="1" autoComplete="off" onChange={this.handleInput} required />
            </div>
          </div>

          <div className="unit-rating">
            <div className="form-group mb-3">
              <label htmlFor="unit-add-cooling-capacity">Cooling Capacity (KJ/hr):</label>
              <input type="text" id="unit-add-cooling-capacity" name="coolingCapacity" value={this.state.coolingCapacity} placeholder="1 KJ/hr" autoComplete="off" onChange={this.handleInput} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="unit-add-capacity-rating">Capacity Rating (HP or TR):</label>
              <input type="text" id="unit-add-capacity-rating" name="capacityRating" value={this.state.capacityRating} placeholder="HP or TR" autoComplete="off" onChange={this.handleInput} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="unit-add-energy-efficiency-ratio">Energy Efficiency Ratio (EER):</label>
              <input type="text" id="unit-add-energy-efficiency-ratio" name="energyEfficiencyRatio" value={this.state.energyEfficiencyRatio} placeholder="EER" autoComplete="off" onChange={this.handleInput} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="unit-add-purchase-year">Year of Purchase:</label>
              <input type="text" id="unit-add-purchase-year" name="purchaseYear" value={this.state.purchaseYear} placeholder="2022" autoComplete="off" onChange={this.handleInput} />
            </div>

            <div className="d-flex mb-3">
              <div className="form-group col-6 mr-2">
                <label htmlFor="unit-add-hours-per-day">Hours per day:</label>
                <input type="number" id="unit-add-hours-per-day" name="hoursPerDay" value={this.state.hoursPerDay} placeholder="8" autoComplete="off" onChange={this.handleInput} />
              </div>

              <div className="form-group col-6">
                <label htmlFor="unit-add-days-per-week">Days per week:</label>
                <input type="number" id="unit-add-days-per-week" name="daysPerWeek" value={this.state.daysPerWeek} placeholder="5" autoComplete="off" onChange={this.handleInput} />
              </div>
            </div>
          </div>
        </div>

        <div className={statusClass}>{ this.state.error || this.state.added }</div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={this.state.submitting}>
            <PaperPlaneIcon width={17} height={16} fill="currentColor" className="fa mr-2" />
            { this.state.submitting ? 'Submitting' : 'Submit' }
          </button>
        </div>
      </form>
    );
  }
}

export default UnitAdd;
