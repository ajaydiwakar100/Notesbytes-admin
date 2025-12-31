import React, { Component } from 'react'
export default class Dashboard extends Component {
    render(){
        return (
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6">
                            <h1 className="m-0 text-dark">Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
               <section className="content">
                    <div className="container-fluid">
                        <div className="row">

                        {/* Total Users */}
                        <div className="col-lg-3 col-6">
                            <a href="">
                            <div className="small-box bg-orange">
                                <div className="inner">
                                <p>Total Users</p>
                                <h3>10</h3>
                                </div>
                                <div className="icon">
                                <i className="fa fa-users"></i>
                                </div>
                            </div>
                            </a>
                        </div>

                        {/* Total Active Users */}
                        <div className="col-lg-3 col-6">
                            <a href="">
                            <div className="small-box bg-blue">
                                <div className="inner">
                                <p>Total Active Users</p>
                                <h3>10</h3>
                                </div>
                                <div className="icon">
                                <i className="fa fa-user-check"></i>
                                </div>
                            </div>
                            </a>
                        </div>

                        {/* Total Notes Uploaded */}
                        <div className="col-lg-3 col-6">
                            <a href="">
                            <div className="small-box bg-green">
                                <div className="inner">
                                <p>Total Notes Uploaded</p>
                                <h3>10</h3>
                                </div>
                                <div className="icon">
                                <i className="fa fa-file-alt"></i>
                                </div>
                            </div>
                            </a>
                        </div>

                        {/* Total Sales */}
                        <div className="col-lg-3 col-6">
                            <a href="">
                            <div className="small-box bg-red">
                                <div className="inner">
                                <p>Total Sales</p>
                                <h3>10</h3>
                                </div>
                                <div className="icon">
                                <i className="fa fa-shopping-cart"></i>
                                </div>
                            </div>
                            </a>
                        </div>

                        {/* Total Commission */}
                        <div className="col-lg-3 col-6">
                            <a href="">
                            <div className="small-box bg-purple">
                                <div className="inner">
                                <p>Total Commission</p>
                                <h3>10</h3>
                                </div>
                                <div className="icon">
                                <i className="fa fa-coins"></i>
                                </div>
                            </div>
                            </a>
                        </div>

                        {/* Pending Payouts */}
                        <div className="col-lg-3 col-6">
                            <a href="">
                            <div className="small-box bg-pink">
                                <div className="inner">
                                <p>Pending Payouts</p>
                                <h3>10</h3>
                                </div>
                                <div className="icon">
                                <i className="fa fa-wallet"></i>
                                </div>
                            </div>
                            </a>
                        </div>

                        </div>
                    </div>
                </section>
            </div>    
        )
    }
}