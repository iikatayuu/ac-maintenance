
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import $ from 'jquery';

import SearchForm from '../SearchForm';
import UnitAdd from '../UnitAdd';
import UnitView from '../UnitView';
import UnitEdit from '../UnitEdit';
import NotFound from '../NotFound';

import sealLogo from '../../assets/imgs/seal.png';
import BarsIcon from '../../assets/svgs/bars.svg';
import MagnifyingGlassIcon from '../../assets/svgs/magnifying-glass.svg';
import PlusIcon from '../../assets/svgs/plus.svg';
import './style.scss';

class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      sidebar: false
    };

    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar (event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ sidebar: !this.state.sidebar });
  }

  componentDidMount () {
    $(document).on('click', (event) => {
      if (!event.target.matches('.sidebar') && !event.target.matches('#sidebar-toggle')) {
        this.setState({ sidebar: false });
      }
    });
  }

  render () {
    const sidebarNavClass = ({ isActive }) => {
      return 'mb-2' + (isActive ? ' active' : '');
    };

    return (
      <React.Fragment>
        <header className="header">
          <div className="header-brand">
            <div id="sidebar-toggle" className="d-none" onClick={(e) => this.toggleSidebar(e)}>
              <BarsIcon width={20} height={20} fill="currentColor" className="fa mr-2" />
            </div>

            <img src={sealLogo} alt="Negros Occidental Provincial Capitol Seal" width={48} height={48} className="mr-2" />
            <strong>Negros Occidental Provincial Capitol | AC Maintenance System</strong>
          </div>
        </header>

        <div className="d-flex d-md-block">
          <aside className={ 'sidebar' + (this.state.sidebar ? ' active' : '') }>
            <nav>
              <NavLink to="/" className={sidebarNavClass}>
                <MagnifyingGlassIcon width={16} height={16} fill="currentColor" className="fa mr-2" /> Search
              </NavLink>

              <NavLink to="/unit" className={sidebarNavClass}>
                <PlusIcon width={16} height={16} fill="currentColor" className="fa mr-2" /> Add AC Unit
              </NavLink>
            </nav>
          </aside>

          <main className="main">
            <Routes>
              <Route path="/">
                <Route index element={<SearchForm />} />

                <Route path="unit">
                  <Route index element={<UnitAdd />} />
                  <Route path=":id" element={<UnitView />} />
                  <Route path=":id/edit" element={<UnitEdit />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
