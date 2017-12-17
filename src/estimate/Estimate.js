import React from 'react';

import { Operation } from '../summary/Operations';
import { formatCurrency, sortWithAbsoluteValue } from "../utilities/Currency";
import { getBudgets } from '../services/Operations';

class Estimate extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            operations: [],
            newEstimateLabel: "",
            newEstimateAmount: ""
        };

        this.updateField = this.updateField.bind(this);
        this.onImportBudgets = this.onImportBudgets.bind(this);
        this.onRemoveEstimate = this.onRemoveEstimate.bind(this);
        this.validateWithEnterKey = this.validateWithEnterKey.bind(this);
        this.onValidateNewEstimate = this.onValidateNewEstimate.bind(this);
    }

    updateField(field, value) {
        this.setState({ [field]: value });
    }

    validateWithEnterKey(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.onValidateNewEstimate();
        }
    }

    onImportBudgets() {
        getBudgets(budgets => {
            this.setState((prevState) => ({ operations: budgets.concat(prevState.operations) }));
        });
    }

    onRemoveEstimate(index) {
        this.setState(prevState => {
            prevState.operations.splice(index, 1);

            return { operations: prevState.operations };
        });
    }

    onValidateNewEstimate() {
        const { newEstimateLabel, newEstimateAmount } = this.state;

        if (!newEstimateLabel || !newEstimateAmount) {
            return alert('Some fields are missing…');
        }

        this.setState(prevState => ({
            operations: [{ label: newEstimateLabel, amount: parseInt(newEstimateAmount) }].concat(prevState.operations),
            newEstimateLabel: "",
            newEstimateAmount: ""
        }));

        this.newEstimateLabelInput.focus();
    }

    render() {
        let { operations } = this.state;

        operations = operations.filter(est => est.amount >= 0).sort(sortWithAbsoluteValue)
            .concat(operations.filter(est => est.amount < 0).sort(sortWithAbsoluteValue));

        return (
            <div>
                <h5>Estimate</h5>
                <div className="row mt-3">
                    <div className="col-sm-12 col-md-6">
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center operations-group">
                                Estimate
                                <p className="operations-summary mb-0 text-right">
                                    {formatCurrency(operations.reduce((sum, operation) => sum + operation.amount, 0))}<br />
                                    <small className="text-green mr-2" title="Budget credits">{formatCurrency(operations.filter(op => op.amount >= 0).reduce((sum, op) => sum + op.amount, 0))}</small>
                                    <small className="text-red" title="Budget debits">{formatCurrency(operations.filter(op => op.amount < 0).reduce((sum, op) => sum + op.amount, 0))}</small>
                                </p>
                            </li>

                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="input-group input-group-sm">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Estimate"
                                        ref={(input) => this.newEstimateLabelInput = input }
                                        onChange={(e) => this.updateField('newEstimateLabel', e.target.value)}
                                        value={this.state.newEstimateLabel} />

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Amount"
                                        onChange={(e) => this.updateField('newEstimateAmount', e.target.value)}
                                        onKeyUp={this.validateWithEnterKey}
                                        value={this.state.newEstimateAmount}/>

                                    <span className="input-group-btn">
                                    <button className="btn btn-primary" type="button" onClick={this.onValidateNewEstimate}>Add</button>
                                </span>
                                </div>
                            </li>

                            {!operations.length &&
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <small>No estimate</small>
                                </li>
                            }

                            {operations.map((operation, index) => <Operation key={index} operation={operation} onRemove={() => this.onRemoveEstimate(index)} />)}
                        </ul>

                        <p className="mt-2 mb-5">
                            <button type="button" className="btn btn-link btn-sm" onClick={this.onImportBudgets}>Import budgets</button>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

}

export default Estimate;