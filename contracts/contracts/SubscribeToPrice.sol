// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";

struct UpdateCondition {
    bool isPrice;
    bool isTime;
    uint256 priceDifference;
    uint256 timeDifference;
}

struct Subscription {
    address subscriber;
    uint256 price;
    uint256 balance;
    UpdateCondition update;
}

contract SubscribeToPrice {
    // Subscription[] public subscriptions;
    mapping(bytes32 => Subscription[]) public subscriptions;
    IPyth pyth;

    constructor(address pythContract) {
        pyth = IPyth(pythContract);
    }

    function registerSubscription(
        bytes32 priceId,
        uint256 price,
        bool isPrice,
        bool isTime,
        uint256 priceDifference,
        uint256 timeDifference
    ) public payable {
        require(msg.value >= price, "Not enough funds to create subscription");
        UpdateCondition memory updateCondition = UpdateCondition({
            isPrice: isPrice,
            isTime: isTime,
            priceDifference: priceDifference,
            timeDifference: timeDifference
        });
        subscriptions[priceId].push(
            Subscription({
                subscriber: msg.sender,
                price: price,
                balance: msg.value,
                update: updateCondition
            })
        );
    }

    function submitUpdate(
        bytes[] calldata priceUpdateData,
        bytes32[] memory priceIds,
        uint256[][] memory subscriptionIndices
    ) public payable {
        require(priceIds.length == subscriptionIndices.length, "Invalid input");
        uint fee = pyth.getUpdateFee(priceUpdateData);
        pyth.updatePriceFeeds{value: fee}(priceUpdateData);
        for (uint j = 0; j < priceIds.length; j++) {
            bytes32 priceId = priceIds[j];
            PythStructs.Price memory prevPrice = pyth.getPrice(priceId);
            PythStructs.Price memory price = pyth.getPrice(priceId);

            for (uint i = 0; i < subscriptionIndices[j].length; i++) {
                Subscription storage subscription = subscriptions[priceId][
                    subscriptionIndices[j][i]
                ];
                if (subscription.update.isPrice) {
                    require(
                        abs(
                            (100 * (int(price.price) - int(prevPrice.price))) /
                                int(price.price)
                        ) >= int(subscription.update.priceDifference),
                        "Price difference not met"
                    );
                }
                if (subscription.update.isTime) {
                    require(
                        price.publishTime - prevPrice.publishTime >=
                            subscription.update.timeDifference,
                        "Time difference not met"
                    );
                }
                payable(msg.sender).transfer(subscription.price);
                subscription.balance -= subscription.price;
                if (subscription.balance <= subscription.price) {
                    payable(msg.sender).transfer(subscription.balance);
                    delete subscriptions[priceId][subscriptionIndices[j][i]];
                }
            }
        }
    }

    function deleteSubscription(bytes32 priceId, uint256 index) public {
        require(
            subscriptions[priceId][index].subscriber == msg.sender,
            "Only the subscriber can delete a subscription"
        );
        payable(msg.sender).transfer(subscriptions[priceId][index].balance);
        delete subscriptions[priceId][index];
    }

    function viewSubscriptions(
        bytes32 priceId
    ) public view returns (Subscription[] memory) {
        return subscriptions[priceId];
    }

    function abs(int x) private pure returns (int) {
        return x >= 0 ? x : -x;
    }
}
