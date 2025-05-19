import { SearchIcon, Edit2, Check, X } from "lucide-react";
import { useState, useRef } from "react";
import "./Users.css";
import { adminService } from "../../Service/adminService";

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [updatingRoles, setUpdatingRoles] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: "", text: "" });

  const availableRoles = ["ROLE_USER", "ROLE_ADMIN", "ROLE_SELLER"];

  const editFormRef = useRef(null);

  const searchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await adminService.searchUsers(searchTerm, page, size);
      setUsers(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const startEditingRoles = (user) => {
    setEditingUser(user);
    setSelectedRoles([...user.roles]);
  };

  const cancelEditingRoles = () => {
    setEditingUser(null);
    setSelectedRoles([]);
  };

  const toggleRole = (role) => {
    let updatedRoles = [...selectedRoles];

    if (updatedRoles.includes(role)) {
      updatedRoles = updatedRoles.filter((r) => r !== role);
    } else {
      updatedRoles = [role];
    }

    setSelectedRoles(updatedRoles);
  };

  const updateUserRoles = async () => {
    setUpdatingRoles(true);
    setUpdateMessage({ type: "", text: "" });

    try {
      const updatedUser = await adminService.updateUserRoles(
        editingUser.id,
        selectedRoles
      );

      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      setUpdateMessage({
        type: "success",
        text: `Roles for ${updatedUser.email} updated successfully.`,
      });

      setTimeout(() => {
        setEditingUser(null);
        setSelectedRoles([]);
        setUpdateMessage({ type: "", text: "" });
      }, 2000);
    } catch (err) {
      setUpdateMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setUpdatingRoles(false);
    }
  };

  return (
    <div className="containerOfUsersPage">
      <h1>User Management</h1>

      <form onSubmit={handleSearch} className="search-container">
        <div className="search-bar">
          <SearchIcon className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" type="submit">
            Search
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}
      {updateMessage.text && (
        <div className={`message ${updateMessage.type}`}>
          {updateMessage.text}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loader"></div>
          <span>Loading users...</span>
        </div>
      ) : (
        <>
          {users.length > 0 ? (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Roles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>
                        <div className="role-badges">
                          {user.roles.map((role) => (
                            <span
                              key={role}
                              className={`role-badge ${role.toLowerCase()}`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => startEditingRoles(user)}
                          title="Edit user roles"
                        >
                          <Edit2 size={16} />
                          <span>Edit Roles</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className="pagination-button"
                  >
                    Previous
                  </button>
                  <span className="page-indicator">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : searchTerm ? (
            <div className="no-results">
              No users found matching {searchTerm}
            </div>
          ) : (
            <div className="start-search">
              <p>Enter an email to search for users</p>
            </div>
          )}
        </>
      )}

      {editingUser && (
        <div className="modal-overlay">
          <div className="edit-roles-modal" ref={editFormRef}>
            <div className="modal-header">
              <h3>Edit User Roles</h3>
              <button className="close-button" onClick={cancelEditingRoles}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p className="user-email">{editingUser.email}</p>

              <div className="roles-selection">
                <p className="roles-label">Select roles:</p>
                <div className="roles-toggle-buttons">
                  {availableRoles.map((role) => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        className={`role-toggle-button ${
                          isSelected ? "active" : ""
                        }`}
                        onClick={() => toggleRole(role)}
                        type="button"
                      >
                        {isSelected ? <Check size={16} /> : null}
                        {role.replace("ROLE_", "")}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={cancelEditingRoles}
                disabled={updatingRoles}
              >
                Cancel
              </button>
              <button
                className="save-button"
                onClick={updateUserRoles}
                disabled={updatingRoles}
              >
                {updatingRoles ? (
                  <>
                    <div className="button-loader"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
