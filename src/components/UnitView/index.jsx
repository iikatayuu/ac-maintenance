
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

import Operations from '../Operations';
import XIcon from '../../assets/svgs/x.svg';
import PenIcon from '../../assets/svgs/pen.svg';
import './style.scss';

class UnitView extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      office: '',
      area: '',
      type: '',
      status: '',
      category: '',
      coolingCapacity: '',
      capacityRating: '',
      energyEfficiencyRatio: '',
      purchaseYear: '',
      hoursPerDay: 0,
      daysPerWeek: 0,
      operations: []
    };
  }

  async componentDidMount () {
    const unitId = this.props.params.id;
    const response = await axios.get(`/api/units/unit/${unitId}`);
    const data = response.data;

    if (data.success) {
      const unit = data.unit;
      this.setState({
        office: unit.office_name,
        area: unit.area,
        type: unit.type,
        status: unit.status,
        category: unit.category,
        coolingCapacity: unit.cooling_capacity,
        capacityRating: unit.capacity_rating,
        energyEfficiencyRatio: unit.energy_efficiency_ratio,
        purchaseYear: unit.purchase_year,
        hoursPerDay: unit.hours_per_day,
        daysPerWeek: unit.days_per_week
      });
    }
  }

  render () {
    const unitId = this.props.params.id;
    return (
      <div id="unit-view" className="m-4">
        <div className="d-flex flex-space-between mb-2">
          <h3>Viewing AC Unit ID: { unitId }</h3>
          <div>
            <NavLink to={`/unit/${unitId}/edit`} className="btn mr-2" role="button">
              <PenIcon width={16} height={16} fill="currentColor" className="fa mr-1" /> Edit
            </NavLink>

            <a href="#" className="btn btn-danger" role="button" onClick={window.close}>
              <XIcon width={16} height={16} fill="currentColor" className="fa mr-1" /> Close
            </a>
          </div>
        </div>

        <div className="d-flex d-md-block">
          <div>
            <div className="details-container details-view box">
              <div className="details-group">
                <span className="details-header">Office:</span>
                <span className="details-value">{ this.state.office }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Area:</span>
                <span className="details-value">{ this.state.area }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Type:</span>
                <span className="details-value">{ this.state.type }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Status:</span>
                <span className="details-value">{ this.state.status }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Category:</span>
                <span className="details-value">{ this.state.category }</span>
              </div>
            </div>

            <div className="details-container details-view-rating box my-3">
              <h4 className="f-bold mb-2">Nameplate Rating, Year of Purchase, and Operation</h4>
              <div className="details-group">
                <span className="details-header">Cooling Capacity:</span>
                <span className="details-value">{ this.state.coolingCapacity || '<NOT SET>' }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Capacity Rating:</span>
                <span className="details-value">{ this.state.capacity_rating || '<NOT SET>' }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Energy Efficiency Ratio:</span>
                <span className="details-value">{ this.state.energyEfficiencyRatio || '<NOT SET>' }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Year of Purchase:</span>
                <span className="details-value">{ this.state.purchaseYear || '<NOT SET>' }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Hours per Day:</span>
                <span className="details-value">{ this.state.hoursPerDay || '<NOT SET>' }</span>
              </div>

              <div className="details-group">
                <span className="details-header">Days per Week</span>
                <span className="details-value">{ this.state.daysPerWeek || '<NOT SET>' }</span>
              </div>
            </div>
          </div>

          <div className="flex-1 mx-4">
            <div className="border-bottom mb-3 p-2">
              <h2>Recent Operations</h2>
              <p>Edit this unit to add new operation</p>
            </div>

            <Operations id={unitId} className="m-2" />
          </div>
        </div>
      </div>
    );
  }
}

UnitView.propTypes = {
  params: PropTypes.exact({
    id: PropTypes.number.isRequired
  })
};

export default function UnitViewWrapper () {
  const params = useParams();
  return <UnitView params={params} />;
}
