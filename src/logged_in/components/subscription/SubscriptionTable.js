import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow
} from "@material-ui/core";
import classNames from "classnames";
import EnhancedTableHead from "../../../shared/EnhancedTableHead";
import ColorfulChip from "../../../shared/ColorfulChip";
import unixToDateString from "../../../shared/unixToDateString";
import HighlightedInformation from "../../../shared/HighlightedInformation";
import currencyPrettyPrint from "../../../shared/currencyPrettyPrint";

const styles = theme => ({
  tableWrapper: {
    overflowX: "auto"
  },
  blackBackground: {
    backgroundColor: theme.palette.primary.main
  },
  contentWrapper: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2)
    }
  },
  dBlock: {
    display: "block !important"
  },
  dNone: {
    display: "none !important"
  }
});

const rows = [
  {
    id: "description",
    numeric: false,
    label: "Action"
  },
  {
    id: "balanceChange",
    numeric: false,
    label: "Balance change"
  },
  {
    id: "date",
    numeric: false,
    label: "Date"
  },
  {
    id: "paidUntil",
    numeric: false,
    label: "Paid until"
  }
];

class SubscriptionTable extends PureComponent {
  state = {
    page: 0
  };

  rowsPerPage = 25;

  handleChangePage = (_, page) => {
    this.setState({ page });
  };

  render() {
    const { page } = this.state;
    const { transactions, theme, classes } = this.props;
    if (transactions.length > 0) {
      return (
        <div className={classNames("w-100", classes.tableWrapper)}>
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead rowCount={transactions.length} rows={rows} />
            <TableBody>
              {transactions
                .slice(
                  page * this.rowsPerPage,
                  page * this.rowsPerPage + this.rowsPerPage
                )
                .map((transaction, index) => (
                  <TableRow hover tabIndex={-1} key={index}>
                    <TableCell component="th" scope="row" className="pl-3">
                      {transaction.description}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {transaction.balanceChange > 0 ? (
                        <ColorfulChip
                          label={`+${currencyPrettyPrint(
                            transaction.balanceChange
                          )}`}
                          color={theme.palette.secondary.main}
                        />
                      ) : (
                        <ColorfulChip
                          label={currencyPrettyPrint(transaction.balanceChange)}
                          color={theme.palette.error.dark}
                        />
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {unixToDateString(transaction.timestamp)}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {transaction.paidUntil
                        ? unixToDateString(transaction.paidUntil)
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={transactions.length}
            rowsPerPage={this.rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            classes={{
              select: classes.dNone,
              selectIcon: classes.dNone,
              actions: transactions.length > 0 ? classes.dBlock : classes.dNone,
              caption: transactions.length > 0 ? classes.dBlock : classes.dNone
            }}
            labelRowsPerPage=""
          />
        </div>
      );
    }
    return (
      <div className={classNames("w-100", classes.contentWrapper)}>
        <HighlightedInformation>
          No transactions received yet.
        </HighlightedInformation>
      </div>
    );
  }
}

SubscriptionTable.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  transactions: PropTypes.array
};

export default withStyles(styles, { withTheme: true })(SubscriptionTable);