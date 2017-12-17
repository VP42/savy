import React from 'react';
import { Link } from 'react-router-dom'

import { formatCurrency } from '../utilities/Currency';

export const Operation = ({ operation, onToggle, onRemove }) => (
    <li className={`list-group-item d-flex justify-content-between align-items-center operation-line ${operation.status === 'checked' ? 'operation-checked' : ''}`}>
        <div className="form-check mb-0">
            <label className="form-check-label operation-label">
                {onToggle &&
                    <input
                        className="form-check-input"
                        type="checkbox"
                        defaultChecked={operation.status === "checked"}
                        onChange={() => onToggle(operation.id, operation.status === 'checked' ? 'pending' : 'checked')} />
                }

                {operation.label} <i className="fa fa-fw fa-trash" onClick={(e) => { onRemove(operation.id); } } />
            </label>
        </div>
        <span className={`font-weight-bold ${operation.amount >= 0 ? 'text-green' : 'text-red'}`}>
            {formatCurrency(operation.amount)}
        </span>
    </li>
);

class Operations extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newOperationLabel: "",
            newOperationAmount: "",
            newBudgetLabel: "",
            newBudgetAmount: "",
            displayEditBudgets: false
        };

        this.updateField = this.updateField.bind(this);
        this.validateWithEnterKey = this.validateWithEnterKey.bind(this);
        this.onValidateNewOperation = this.onValidateNewOperation.bind(this);
        this.onValidateNewBudget = this.onValidateNewBudget.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        if (!this.state.displayEditBudgets && nextState.displayEditBudgets) {
            this.props.onEditBudgets();
        }
    }

    onValidateNewOperation() {
        const { onOperationAdded } = this.props;
        const { newOperationLabel, newOperationAmount } = this.state;

        if (!newOperationLabel || !newOperationAmount) {
            return alert('Some fields are missing…');
        }

        onOperationAdded(newOperationLabel, parseInt(newOperationAmount), () => {
            this.setState({ newOperationLabel: "", newOperationAmount: "" });
        });

        this.newOperationLabelInput.focus();
    }

    onValidateNewBudget() {
        const { onBudgetAdded } = this.props;
        const { newBudgetLabel, newBudgetAmount } = this.state;

        if (!newBudgetLabel || !newBudgetAmount) {
            return alert('Some fields are missing…');
        }

        onBudgetAdded(newBudgetLabel, parseInt(newBudgetAmount), () => {
            this.setState({ newBudgetLabel: "", newBudgetAmount: "" });
        });

        this.newBudgetLabelInput.focus();
    }

    updateField(field, value) {
        this.setState({ [field]: value });
    }

    validateWithEnterKey(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.onValidateNewOperation();
        }
    }

    render() {
        const { operations, budgets, onOperationToggled, onOperationRemoved, onImportBudgetOperations, onBudgetRemoved } = this.props;
        const { displayEditBudgets } = this.state;

        if (!operations) {
            return <p>Loading…</p>;
        }

        const extraOperations = operations
            .filter(operation => !operation.from_budget);

        const budgetOperations = operations
            .filter(operation => operation.from_budget);

        return (
            <div className="row mt-2">
                {!displayEditBudgets &&
                <div className="col-sm-12 col-md-6">
                    <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center operations-group">
                            Budget
                            <p className="operations-summary mb-0 text-right">
                                {formatCurrency(budgetOperations.reduce((sum, operation) => sum + operation.amount, 0))}<br />
                                <small className="text-green mr-2" title="Budget credits">{formatCurrency(budgetOperations.filter(op => op.amount >= 0).reduce((sum, op) => sum + op.amount, 0))}</small>
                                <small className="text-red" title="Budget debits">{formatCurrency(budgetOperations.filter(op => op.amount < 0).reduce((sum, op) => sum + op.amount, 0))}</small>
                            </p>
                        </li>

                        {!budgetOperations.length &&
                        <li className="list-group-item d-flex justify-content-between align-items-center">No operation.</li>
                        }

                        {budgetOperations.map(operation => <Operation key={operation.id} operation={operation} onToggle={onOperationToggled} onRemove={onOperationRemoved} />)}
                    </ul>

                    <p className="mt-2 mb-5">
                        <button type="button" className="btn btn-link btn-sm" onClick={onImportBudgetOperations}>Import budgets</button>
                        <button type="button" className="btn btn-link btn-sm" onClick={() => this.setState({ displayEditBudgets: true })}>Edit budgets</button>
                    </p>
                </div>
                }

                {displayEditBudgets &&
                <div className="col-sm-12 col-md-6">
                    <ul className="list-group edit-budgets">
                        <li className="list-group-item d-flex justify-content-between align-items-center operations-group">
                            Budgets
                        </li>

                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="input-group input-group-sm">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Budget"
                                    ref={(input) => this.newBudgetLabelInput = input }
                                    onChange={(e) => this.updateField('newBudgetLabel', e.target.value)}
                                    value={this.state.newBudgetLabel} />

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Amount"
                                    onChange={(e) => this.updateField('newBudgetAmount', e.target.value)}
                                    value={this.state.newBudgetAmount}/>

                                <span className="input-group-btn">
                                        <button className="btn btn-primary" type="button" onClick={this.onValidateNewBudget}>Add</button>
                                    </span>
                            </div>
                        </li>

                        {budgets.map(budget => <Operation key={budget.id} operation={budget} onRemove={onBudgetRemoved} />)}
                    </ul>

                    <p className="mt-2 mb-5">
                        <button type="button" className="btn btn-link btn-sm" onClick={() => this.setState({ displayEditBudgets: false })}>Close set budgets</button>
                    </p>
                </div>
                }

                <div className="col-sm-12 col-md-6">
                    <ul className="list-group">
                        <li className="list-group-item d-flex justify-content-between align-items-center operations-group">
                            Extra
                            <p className="operations-summary mb-0 text-right">
                                {formatCurrency(extraOperations.reduce((sum, operation) => sum + operation.amount, 0))}<br />
                                <small className="text-green mr-2" title="Extra credits">{formatCurrency(extraOperations.filter(op => op.amount >= 0).reduce((sum, op) => sum + op.amount, 0))}</small>
                                <small className="text-red" title="Extra debits">{formatCurrency(extraOperations.filter(op => op.amount < 0).reduce((sum, op) => sum + op.amount, 0))}</small>
                            </p>
                        </li>

                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <div className="input-group input-group-sm">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Operation"
                                    ref={(input) => this.newOperationLabelInput = input }
                                    onChange={(e) => this.updateField('newOperationLabel', e.target.value)}
                                    value={this.state.newOperationLabel} />

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Amount"
                                    onChange={(e) => this.updateField('newOperationAmount', e.target.value)}
                                    onKeyUp={this.validateWithEnterKey}
                                    value={this.state.newOperationAmount}/>

                                <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" onClick={this.onValidateNewOperation}>Add</button>
                                </span>
                            </div>
                        </li>

                        {!extraOperations.length &&
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                            <small>No operation</small>
                        </li>
                        }

                        {extraOperations.map(operation => <Operation key={operation.id} operation={operation} onToggle={onOperationToggled} onRemove={onOperationRemoved} />)}
                    </ul>

                    <p className="mt-2 mb-5">
                        <Link className="btn btn-link btn-sm" to="/estimate">Make an estimate</Link>
                    </p>
                </div>
            </div>
        );
    }
}

export default Operations;
