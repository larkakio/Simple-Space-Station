// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    CheckIn public c;
    address public alice = address(0xA11ce);

    function setUp() public {
        c = new CheckIn();
    }

    function test_checkIn_once_per_day() public {
        vm.startPrank(alice);
        uint256 day0 = block.timestamp / 1 days;

        c.checkIn();
        assertEq(c.lastCheckInDay(alice), day0);
        assertEq(c.streakOf(alice), 1);

        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
        vm.stopPrank();
    }

    function test_reverts_on_eth_sent() public {
        vm.deal(alice, 1 ether);
        vm.startPrank(alice);
        vm.expectRevert(CheckIn.ValueNotAllowed.selector);
        c.checkIn{value: 1 wei}();
        vm.stopPrank();
    }

    function test_streak_consecutive_days() public {
        vm.startPrank(alice);
        c.checkIn();
        assertEq(c.streakOf(alice), 1);

        vm.warp(block.timestamp + 1 days);
        c.checkIn();
        assertEq(c.streakOf(alice), 2);

        vm.warp(block.timestamp + 1 days);
        c.checkIn();
        assertEq(c.streakOf(alice), 3);
        vm.stopPrank();
    }

    function test_streak_resets_after_gap() public {
        vm.startPrank(alice);
        c.checkIn();
        assertEq(c.streakOf(alice), 1);

        vm.warp(block.timestamp + 2 days);
        c.checkIn();
        assertEq(c.streakOf(alice), 1);
        vm.stopPrank();
    }

    function test_fee_constant_zero() public view {
        assertEq(c.CHECK_IN_FEE(), 0);
    }
}
