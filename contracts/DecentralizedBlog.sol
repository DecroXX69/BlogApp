// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedBlog {
    struct Blog {
        uint256 id;
        address author;
        string title;
        string excerpt;
        string contentHash; // IPFS hash for content
        string featuredImageHash; // IPFS hash for image
        string[] tags;
        bool published;
        uint256 createdAt;
        uint256 publishedAt;
    }

    mapping(uint256 => Blog) public blogs;
    mapping(address => uint256[]) public userBlogs;
    uint256 public blogCount;

    event BlogCreated(
        uint256 id,
        address author,
        string title,
        string contentHash,
        bool published
    );
    event BlogUpdated(uint256 id, string title, string contentHash, bool published);
    event BlogDeleted(uint256 id);

    modifier onlyAuthor(uint256 _id) {
        require(blogs[_id].author == msg.sender, "Not authorized");
        _;
    }

    function createBlog(
        string memory _title,
        string memory _excerpt,
        string memory _contentHash,
        string memory _featuredImageHash,
        string[] memory _tags,
        bool _published
    ) external {
        blogCount++;
        uint256 timestamp = block.timestamp;
        blogs[blogCount] = Blog(
            blogCount,
            msg.sender,
            _title,
            _excerpt,
            _contentHash,
            _featuredImageHash,
            _tags,
            _published,
            timestamp,
            _published ? timestamp : 0
        );
        userBlogs[msg.sender].push(blogCount);

        emit BlogCreated(blogCount, msg.sender, _title, _contentHash, _published);
    }

    function updateBlog(
        uint256 _id,
        string memory _title,
        string memory _excerpt,
        string memory _contentHash,
        string memory _featuredImageHash,
        string[] memory _tags,
        bool _published
    ) external onlyAuthor(_id) {
        Blog storage blog = blogs[_id];
        require(blog.id != 0, "Blog not found");

        blog.title = _title;
        blog.excerpt = _excerpt;
        blog.contentHash = _contentHash;
        blog.featuredImageHash = _featuredImageHash;
        blog.tags = _tags;
        if (_published && blog.publishedAt == 0) {
            blog.publishedAt = block.timestamp;
        }
        blog.published = _published;

        emit BlogUpdated(_id, _title, _contentHash, _published);
    }

    function deleteBlog(uint256 _id) external onlyAuthor(_id) {
        require(blogs[_id].id != 0, "Blog not found");
        delete blogs[_id];
        emit BlogDeleted(_id);
    }

    function getBlog(uint256 _id) external view returns (Blog memory) {
        require(blogs[_id].id != 0, "Blog not found");
        return blogs[_id];
    }

    function getUserBlogs(address _author) external view returns (uint256[] memory) {
        return userBlogs[_author];
    }

    function getAllBlogs() external view returns (Blog[] memory) {
        Blog[] memory allBlogs = new Blog[](blogCount);
        for (uint256 i = 1; i <= blogCount; i++) {
            if (blogs[i].id != 0) {
                allBlogs[i - 1] = blogs[i];
            }
        }
        return allBlogs;
    }
}