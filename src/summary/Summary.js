import React from 'react';

import Operations from './Operations';

import {
    getMonthSummary,
    getCurrentMonthOperations,
    add,
    toggle,
    remove,
    importOperationsFromBudget,
    getBudgets,
    addBudget,
    removeBudget
} from '../services/Operations';
import { formatCurrency } from '../utilities/Currency';

class Summary extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            summary: false,
            operations: [],
            budgets: []
        };

        this.refreshSummary = this.refreshSummary.bind(this);
        this.refreshCurrentMonthOperations = this.refreshCurrentMonthOperations.bind(this);

        this.onOperationAdded = this.onOperationAdded.bind(this);
        this.onOperationToggled = this.onOperationToggled.bind(this);
        this.onOperationRemoved = this.onOperationRemoved.bind(this);
        this.onImportBudgetOperations = this.onImportBudgetOperations.bind(this);
        this.onEditBudgets = this.onEditBudgets.bind(this);
        this.onBudgetAdded = this.onBudgetAdded.bind(this);
        this.onBudgetRemoved = this.onBudgetRemoved.bind(this);
    }

    componentWillMount() {
        this.refreshSummary();
        this.refreshCurrentMonthOperations();
    }

    refreshSummary() {
        getMonthSummary(
            summary => this.setState({ summary }),
            error => console.log('An error occured while fetching summary')
        );
    }

    refreshCurrentMonthOperations() {
        getCurrentMonthOperations(
            operations => this.setState({operations}),
            (error) => console.log('An error occured while fetching operations')
        );
    }

    onOperationAdded(label, amount, successCallback) {
        add(label, amount)
            .then(response => response.json()
                .then(operations => {
                    this.setState(operations);
                    this.refreshSummary();

                    successCallback();
                }))
            .catch(err => alert('An error occurred while adding an operation.'));
    }

    onOperationToggled(operation, status) {
        toggle(operation, status)
            .then(response => response.json()
                .then(operations => {
                    this.setState(operations);
                    this.refreshSummary();
                })
            )
            .catch(err => alert('An error occurred while toggling an operation.'));
    }

    onOperationRemoved(operation) {
        remove(operation)
            .then(response => response.json()
                .then(operations => {
                    this.setState(operations);
                    this.refreshSummary();
                })
            )
            .catch(err => alert('An error occurred while toggling an operation.'));
    }

    onImportBudgetOperations() {
        if (window.confirm('Are you sure you want to import budget operations for current month?')) {
            importOperationsFromBudget().then(window.location.reload());
        }
    }

    onEditBudgets() {
        getBudgets(
            budgets => { this.setState({ budgets }); }
        );
    }

    onBudgetAdded(label, amount, successCallback) {
        addBudget(label, amount)
            .then(response => response.json().then(budgets => { this.setState(budgets); successCallback(); }))
            .catch(err => alert('An error occurred while adding a budget.'));
    }

    onBudgetRemoved(budget) {
        removeBudget(budget)
            .then(response => response.json().then(budgets => this.setState(budgets)))
            .catch(err => alert('An error occurred while toggling an operation.'));
    }

    render() {
        const { summary, operations, budgets } = this.state;

        if (!summary) {
            return <p>Loading…</p>;
        }

        return (
            <div>
                <h2 className="mb-4">Savy</h2>

                <div className="row">
                    <Operations
                        operations={operations}
                        budgets={budgets}
                        onOperationAdded={this.onOperationAdded}
                        onOperationToggled={this.onOperationToggled}
                        onOperationRemoved={this.onOperationRemoved}
                        onImportBudgetOperations={this.onImportBudgetOperations}
                        onEditBudgets={this.onEditBudgets}
                        onBudgetAdded={this.onBudgetAdded}
                        onBudgetRemoved={this.onBudgetRemoved}
                    />
                    <div className="col-sm-12 col-md-4">
                        <div className="card mb-3">
                            <div className="card-body summary-block">
                                <h6 className="card-title text-muted text-uppercase">Credit</h6>
                                <h4 className="card-subtitle text-right mb-1">
                                    <p className={`mb-0 ${summary.credit.forecast >= 0 ? 'text-green' : 'text-red'}`}>
                                        <span className="mr-2 current" title="Current credit">({formatCurrency(summary.credit.current)})</span> {formatCurrency(summary.credit.forecast)}
                                    </p>
                                    <small>waiting <strong>{formatCurrency(summary.credit.forecast - summary.credit.current)}</strong></small>
                                </h4>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <div className="card-body summary-block">
                                <h6 className="card-title text-muted text-uppercase">Debit</h6>
                                <h4 className="card-subtitle text-right mb-1">
                                    <p className={`mb-0 ${summary.debit.forecast >= 0 ? 'text-green' : 'text-red'}`}>
                                        <span className="mr-2 current" title="Current debit">({formatCurrency(summary.debit.current)})</span> {formatCurrency(summary.debit.forecast)}
                                    </p>
                                    <small>waiting <strong>{formatCurrency(summary.debit.forecast - summary.debit.current)}</strong></small>
                                </h4>
                            </div>
                        </div>
                        <div className="card mb-3 summary-balance">
                            <div className="card-body summary-block">
                                <h6 className="card-title text-muted text-uppercase">Balance</h6>
                                <h4 className={`card-subtitle text-right mb-1`}>
                                    <p className={`mb-0 ${summary.balance.current >= 0 ? 'text-green' : 'text-red'}`}>
                                        {formatCurrency(summary.balance.forecast)}
                                    </p>
                                    <small>current <strong>{formatCurrency(summary.balance.current)}</strong></small>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Summary;
