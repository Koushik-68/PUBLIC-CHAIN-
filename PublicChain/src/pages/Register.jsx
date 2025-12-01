import React from 'react'
import { useState } from 'react'
import api from '../axios/api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [departmentName, setDepartmentName] = useState('')
  const [departmentType, setDepartmentType] = useState('Other')
  const [stateVal, setStateVal] = useState('')
  const [district, setDistrict] = useState('')
  const [headName, setHeadName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/api/register', {
        name: headName || departmentName,
        email,
        password,
        department_name: departmentName,
        department_type: departmentType,
        state: stateVal,
        district,
        contact_number: contactNumber,
        head_name: headName,
        address,
      })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Department Registration</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Department name</label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department type</label>
          <select value={departmentType} onChange={(e) => setDepartmentType(e.target.value)} className="w-full border rounded px-3 py-2">
            <option>Education</option>
            <option>Health</option>
            <option>Infrastructure</option>
            <option>Welfare</option>
            <option>Environment</option>
            <option>Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input type="text" value={stateVal} onChange={(e) => setStateVal(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Head / Contact person name</label>
          <input type="text" value={headName} onChange={(e) => setHeadName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact number</label>
          <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create account</button>
        </div>
      </form>
    </div>
  )
}
import { useState } from 'react'
import api from '../axios/api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [departmentName, setDepartmentName] = useState('')
  const [departmentType, setDepartmentType] = useState('Other')
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [headName, setHeadName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/api/register', {
        name: headName || departmentName,
        email,
        password,
        department_name: departmentName,
        department_type: departmentType,
        state,
        district,
        contact_number: contactNumber,
        head_name: headName,
        address,
      })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Department Registration</h3>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Department name</label>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Department type</label>
          <select value={departmentType} onChange={(e) => setDepartmentType(e.target.value)} className="w-full border rounded px-3 py-2">
            <option>Education</option>
            <option>Health</option>
            <option>Infrastructure</option>
            <option>Welfare</option>
            <option>Environment</option>
            <option>Other</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Head / Contact person name</label>
          <input type="text" value={headName} onChange={(e) => setHeadName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact number</label>
          <input type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex items-center justify-between">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Create account</button>
        </div>
      </form>
    </div>
  )
}
//             required
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button className="bg-green-600 text-white px-4 py-2 rounded">
//             Create account
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
