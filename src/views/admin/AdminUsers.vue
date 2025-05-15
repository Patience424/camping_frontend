<template>
  <div class="admin-users">
    <div class="header">
      <h1>User Management</h1>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search users..."
          @input="handleSearch"
        >
      </div>
    </div>

    <div class="filters">
      <select v-model="roleFilter" @change="handleFilter">
        <option value="">All Roles</option>
        <option value="user">Users</option>
        <option value="owner">Owners</option>
        <option value="admin">Admins</option>
      </select>
      <select v-model="statusFilter" @change="handleFilter">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role.toLowerCase()">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="user.status.toLowerCase()">
                {{ user.status }}
              </span>
            </td>
            <td>{{ user.joinedDate }}</td>
            <td class="actions">
              <button @click="editUser(user)" class="btn-edit">
                Edit
              </button>
              <button @click="toggleUserStatus(user)" class="btn-status">
                {{ user.status === 'Active' ? 'Suspend' : 'Activate' }}
              </button>
              <button @click="deleteUser(user)" class="btn-delete">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h2>Edit User</h2>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label for="editName">Name</label>
            <input
              id="editName"
              v-model="editingUser.name"
              type="text"
              required
            >
          </div>
          <div class="form-group">
            <label for="editEmail">Email</label>
            <input
              id="editEmail"
              v-model="editingUser.email"
              type="email"
              required
            >
          </div>
          <div class="form-group">
            <label for="editRole">Role</label>
            <select id="editRole" v-model="editingUser.role">
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showEditModal = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsers',
  data() {
    return {
      users: [],
      searchQuery: '',
      roleFilter: '',
      statusFilter: '',
      showEditModal: false,
      editingUser: null
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesRole = !this.roleFilter || user.role.toLowerCase() === this.roleFilter
        const matchesStatus = !this.statusFilter || user.status.toLowerCase() === this.statusFilter
        return matchesSearch && matchesRole && matchesStatus
      })
    }
  },
  async created() {
    // TODO: Fetch users from API
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'User',
        status: 'Active',
        joinedDate: '2024-03-01'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Owner',
        status: 'Active',
        joinedDate: '2024-03-05'
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Admin',
        status: 'Active',
        joinedDate: '2024-02-15'
      }
    ]
  },
  methods: {
    handleSearch() {
      // Search is handled by computed property
    },
    handleFilter() {
      // Filtering is handled by computed property
    },
    editUser(user) {
      this.editingUser = { ...user }
      this.showEditModal = true
    },
    async saveUser() {
      try {
        // TODO: Update user in API
        const index = this.users.findIndex(u => u.id === this.editingUser.id)
        if (index !== -1) {
          this.users[index] = { ...this.editingUser }
        }
        this.showEditModal = false
      } catch (error) {
        console.error('Error updating user:', error)
      }
    },
    async toggleUserStatus(user) {
      try {
        // TODO: Update user status in API
        user.status = user.status === 'Active' ? 'Suspended' : 'Active'
      } catch (error) {
        console.error('Error updating user status:', error)
      }
    },
    async deleteUser(user) {
      if (confirm(`Are you sure you want to delete ${user.name}?`)) {
        try {
          // TODO: Delete user from API
          this.users = this.users.filter(u => u.id !== user.id)
        } catch (error) {
          console.error('Error deleting user:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.admin-users {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-bar input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filters select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 500;
  color: #2c3e50;
}

.role-badge, .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.role-badge.user {
  background: #e3fcef;
  color: #42b983;
}

.role-badge.owner {
  background: #e0f2fe;
  color: #0ea5e9;
}

.role-badge.admin {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.active {
  background: #e3fcef;
  color: #42b983;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #ef4444;
}

.status-badge.suspended {
  background: #f3f4f6;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-status, .btn-delete {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.btn-edit {
  background: #e3fcef;
  color: #42b983;
  border: none;
}

.btn-status {
  background: #e0f2fe;
  color: #0ea5e9;
  border: none;
}

.btn-delete {
  background: #fee2e2;
  color: #ef4444;
  border: none;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background: #42b983;
  color: white;
  border: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}
</style> 