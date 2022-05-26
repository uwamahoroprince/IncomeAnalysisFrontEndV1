import React from "react";

const Widget = (props) => {
  const progress = props.number + 10;
  return (
    <>
      <div className="col-xl-2 col-sm-6 col-12 ">
        <div className="card  border border-secondry">
          <div className="card-body">
            <div className="dash-widget-header ">
              <span className={props.iconBackground}>
                <i className={props.icon}></i>
              </span>
              <div className="">
                <div className="">
                  <span className="h6">{props.title}</span>
                </div>
                <div className="dash-counts">
                  <p className="h5">{props.number}</p>
                </div>
              </div>
            </div>
            <div className="progress progress-sm mt-3">
              <div
                className="progress-bar bg-6"
                role="progressbar"
                style={{ width: props.number }}
                aria-valuenow="75"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p className="text-muted mt-3 mb-0">
              <span className="text-danger me-1">
                <i className="fas fa-arrow-down me-1"></i>
                {props.persentage}.0%
              </span>
              {props.subTitle}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Widget;
