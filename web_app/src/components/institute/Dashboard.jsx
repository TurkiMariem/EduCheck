import React from 'react';
const Dashboard = () => {
  return (
    <div>
     <main>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>D</span>
              <span style={{color: '#EA4335'}}>a</span>
              <span style={{color: '#FBBC05'}}>s</span>
              <span style={{color: '#4285F4'}}>h</span>
              <span style={{color: '#34A853'}}>b</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#4285F4'}}>a</span>
              <span style={{color: '#EA4335'}}>r</span>
              <span style={{color: '#FBBC05'}}>d</span>
            </h1>
					<ul  className="breadcrumb">
						<li>
							<a href="#">Dashboard</a>
						</li>
						<li><i  className='bx bx-chevron-right' ></i></li>
						<li>
							<a  className="active" href="#">Home</a>
						</li>
					</ul>
				</div>
				<a href="#"  className="btn-download">
					<i  className='bx bxs-cloud-download' ></i>
					<span  className="text">Download PDF</span>
				</a>
			</div>
			<ul  className="box-info">
				<li>
					<i  className='bx bxs-calendar-check' ></i>
					<span  className="text">
						<h3>1020</h3>
						<p>Conferences</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-group' ></i>
					<span  className="text">
						<h3>2834</h3>
						<p>Institutes</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>112543</h3>
						<p>Verified Diplomas</p>
					</span>
				</li>
				<li>
					<i  className='bx bxs-dollar-circle' ></i>
					<span  className="text">
						<h3>112543</h3>
						<p>Verified Diplomas</p>
					</span>
				</li>
			</ul>
			<div  className="table-data" style={{ backgroundColor:"#DAE1BC" }}>
				<div  className="order">
					<div  className="head">
						<h3>Recent Activities</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Activitie</th>
								<th>Date</th>
								<th>time</th>
								<th>details</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<p>Add diploma</p>
								</td>
								<td>01-10-2021</td>
								<td>11:56</td>
								<td>11:56</td>
							</tr>
							<tr>
								<td>
									<p>Add Multi Diploma</p>
								</td>
								<td>01-10-2021</td>
								<td>01:21</td>
								<td>01:21</td>
							</tr>
							<tr>
								<td>
									<p>Add Multi Diploma</p>
								</td>
								<td>01-10-2021</td>
								<td>01:21</td>
								<td>01:21</td>
							</tr>
							<tr>
								<td>
									<p>Add Multi Diploma</p>
								</td>
								<td>01-10-2021</td>
								<td>01:21</td>
								<td>01:21</td>
							</tr>
							
						</tbody>
					</table>
				</div>
				<div  className="todo">
					<div  className="head">
						<h3>Todos</h3>
						<i  className='bx bx-plus' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<ul  className="todo-list">
						<li  className="completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
						<li  className="completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
						<li  className="not-completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
						<li  className="completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
						<li  className="not-completed">
							<p>Todo List</p>
							<i  className='bx bx-dots-vertical-rounded' ></i>
						</li>
					</ul>
				</div>
			</div>
		</main>
    </div>
  );
};

export default Dashboard;