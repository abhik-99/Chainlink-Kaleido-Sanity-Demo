// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract APIConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;
  
    uint256 public status;
    
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor() {
        setPublicChainlinkToken();
        oracle = 0x9904415Db0B70fDd242b6Fe835d2bBc155466e8e;
        jobId = "69cf5186b05a4497be74f85236e8ba34";
        fee = 0 * 10 ** 18; // (Varies by network and job)
    }

    
    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestTodo(string calldata id) public returns (bytes32 requestId) 
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        
        // Set the URL to perform the GET request on
        request.add("get", string(abi.encodePacked("https://jsonplaceholder.typicode.com/todos/", id)));
        
        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        // request.add("path", "RAW.ETH.USD.VOLUME24HOUR"); // Chainlink nodes prior to 1.0.0 support this format
        request.add("path", "completed"); // Chainlink nodes 1.0.0 and later support this format
        
        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }
    
    /**
     * Receive the response in the form of uint256
     */ 
    function fulfill(bytes32 _requestId, bool _completed) public recordChainlinkFulfillment(_requestId)
    {
        if(_completed)
            status = 1;
        else
            status = 2;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}