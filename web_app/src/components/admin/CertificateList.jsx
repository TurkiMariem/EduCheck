import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useAsyncDebounce, useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
      <button className="google-search-button"></button>
    </span>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({column: { filterValue, preFilteredRows, setFilter }}) {
 const count = preFilteredRows.length
 return (
   <input
     value={filterValue || ''}
     onChange={e => {
       setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
     }}
     placeholder={`Search ${count} records...`}
     style={{
        fontSize: '1.1rem',
        border: '0',
        borderRadius:'10'
      }}
   /> )}
   const CertificateList = () => {
    const [students, setStudents] = useState([]);
    const [Diplomas, setDiplomas] = useState([]);
    const instituteId = useMemo(() => localStorage.getItem("instituteID"), []); // Ensure this value is memoized and doesn't change
    console.log("instituteId",instituteId);
    const [error, setError] = useState('');
  
    const fetchDiplomas= async () => {
      try {
        const url = `http://localhost:5000/diplomas`;
        const response = await axios.get(url);
        console.log('diplomas:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
    };
  
    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const studentsData = await fetchDiplomas();
          setDiplomas(studentsData);
        } catch (error) {
          setError('Error fetching students');
        }
      };
  
      fetchStudents();
    }, [instituteId]); // Only depend on instituteId which should be constant
  
    const columns = useMemo(
      () => [
        {
          Header: 'Institute Name',
          accessor: 'col1', // accessor is the "key" in the data
        },
        {
          Header: 'Student Name',
          accessor: 'col2',
        },
        {
          Header: 'Institute Email',
          accessor: 'col3',
        },
        {
          Header: 'Date of Birth',
          accessor: 'col4',
        },
        {
          Header: 'Mention',
          accessor: 'col5',
        },
        {
          Header: 'Date Remise',
          accessor: 'col6',
        },
        {
          Header: 'Student CIN',
          accessor: 'col7',
        },
        {
          Header: 'Diplome Ref',
          accessor: 'col9',
        },
        {
          Header: 'Status',
          accessor: 'col10',
        },
      ],
      []
    );
  
    const data = useMemo(
      () =>
        students.map((student) => ({
          col1: student.studentName, // Institute Name
          col2: student.studentEmail, // Student Name
          col3: student.studentCIN, // Institute Email
          col4: student.diplomeName, // Date of Birth
          col5: student.diplomeRef, // Mention
          col6: student.mention, // Date Remise
          col7: student.birthDay, // Diploma
          col8: student.diplomeHash, // Student CIN
          col9: student.remiseDay, // Diploma Ref IPFS FILE HASH
          col10: student.status, // Status
        })),
      [students]
    );
  
    const defaultColumn = useMemo(
      () => ({
        // Let's set up our default Filter UI
        Filter: DefaultColumnFilter,
      }),
      []
    );
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      state,
      visibleColumns,
      preGlobalFilteredRows,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data,
        defaultColumn, // Be sure to pass the defaultColumn option
      },
      useFilters,
      useGlobalFilter,
      useSortBy
    );
  
    return (
      <>
        <main>
          <h2 className="google-search-heading">
            <span style={{ color: '#4285F4' }}>S</span>
            <span style={{ color: '#EA4335' }}>e</span>
            <span style={{ color: '#FBBC05' }}>a</span>
            <span style={{ color: '#4285F4' }}>r</span>
            <span style={{ color: '#34A853' }}>c</span>
            <span style={{ color: '#EA4335' }}>h</span>{' '}
            <span style={{ color: '#4285F4' }}>D</span>
            <span style={{ color: '#EA4335' }}>i</span>
            <span style={{ color: '#FBBC05' }}>p</span>
            <span style={{ color: '#4285F4' }}>l</span>
            <span style={{ color: '#34A853' }}>o</span>
            <span style={{ color: '#EA4335' }}>m</span>
            <span style={{ color: '#FBBC05' }}>a</span>
          </h2>
          <div className="table-data">
            <div className="order">
              <div className="head">
                <table {...getTableProps()}>
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render('Header')}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? '🔽'
                                  : '🔼'
                                : ''}
                            </span>
                            <div>{column.canFilter ? column.render('Filter') : null}</div>
                          </th>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <th colSpan={visibleColumns.length}>
                        <GlobalFilter
                          preGlobalFilteredRows={preGlobalFilteredRows}
                          globalFilter={state.globalFilter}
                          setGlobalFilter={setGlobalFilter}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              style={{
                                padding: '10px',
                                border: 'solid 1px gray',
                              }}
                            >
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  };
  
  export default CertificateList;