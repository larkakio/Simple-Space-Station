// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Daily check-in on Base. User pays only L2 gas; `msg.value` must be zero.
contract CheckIn {
    uint256 public constant CHECK_IN_FEE = 0;

    /// @dev Last block.timestamp when user checked in (0 = never).
    mapping(address => uint256) private _lastCheckAt;
    mapping(address => uint256) private _streak;

    event CheckedIn(address indexed user, uint256 indexed day, uint256 streak);

    error AlreadyCheckedInToday();
    error ValueNotAllowed();

    function lastCheckInDay(address user) external view returns (uint256) {
        uint256 t = _lastCheckAt[user];
        return t == 0 ? 0 : t / 1 days;
    }

    function streakOf(address user) external view returns (uint256) {
        return _streak[user];
    }

    /// @notice One successful check-in per UTC calendar day. Streak increases for consecutive days.
    function checkIn() external payable {
        if (msg.value != 0) revert ValueNotAllowed();

        uint256 lastTs = _lastCheckAt[msg.sender];
        uint256 today = block.timestamp / 1 days;

        if (lastTs != 0 && lastTs / 1 days == today) {
            revert AlreadyCheckedInToday();
        }

        uint256 lastDay = lastTs == 0 ? 0 : lastTs / 1 days;

        uint256 newStreak;
        if (lastTs == 0) {
            newStreak = 1;
        } else if (lastDay == today - 1) {
            newStreak = _streak[msg.sender] + 1;
        } else {
            newStreak = 1;
        }

        _lastCheckAt[msg.sender] = block.timestamp;
        _streak[msg.sender] = newStreak;

        emit CheckedIn(msg.sender, today, newStreak);
    }
}
