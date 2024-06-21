// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    enum Status {
        Pending,
        Shipped,
        Delivered,
        Cancelled
    }

    struct Order {
        uint id;
        string item;
        uint quantity;
        Status status;
    }

    Order[] public orders;

    function createOrder(
        uint _id,
        string memory _item,
        uint _quantity
    ) public returns (uint256) {
        orders.push(
            Order({
                id: _id,
                item: _item,
                quantity: _quantity,
                status: Status.Pending
            })
        );

        return orders.length - 1;
    }

    function updateOrderStatus(uint _orderId, Status _status) public {
        require(_orderId < orders.length, "Invalid order ID");
        orders[_orderId].status = _status;
    }

    function getOrder(
        uint _orderId
    ) public view returns (uint, string memory, uint, Status) {
        require(_orderId < orders.length, "Invalid order ID");
        Order storage order = orders[_orderId];
        return (order.id, order.item, order.quantity, order.status);
    }
}
