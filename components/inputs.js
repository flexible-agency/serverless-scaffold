import React from "react";
import { HelpCircle, Trash } from "react-feather";

export const TextInput = ({ title, value, onChange, ...props }) => {
  const id = title.toLowerCase().replace(/[^\w]+/gi, "");
  return (
    <>
      <label className="block font-medium text-gray-500 mb-1" htmlFor={id}>
        {title}
      </label>
      <input
        type="text"
        id={id}
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        className="mb-6 border-gray-300 rounded-md w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </>
  );
};

export const Checkboxes = ({
  title,
  options,
  value = [],
  onChange,
  ...props
}) => {
  return (
    <>
      <div className="block font-medium text-gray-500 mb-1">{title}</div>
      <div className="mb-5">
        {options.map((opt) => {
          if (typeof opt === "string") {
            opt = {
              id: opt,
              title: opt,
            };
          }
          return (
            <label className="flex items-center gap-2 mb-1">
              <input
                {...props}
                id={opt.id}
                type="checkbox"
                disabled={!!opt.disabled}
                className="rounded-md"
                checked={(value || []).includes(opt.id)}
                onChange={() => {
                  if ((value || []).includes(opt.id)) {
                    onChange((value || []).filter((v) => v !== opt.id));
                  } else {
                    onChange([...(value || []), opt.id]);
                  }
                }}
                value={opt.id}
              />
              {opt.title}
            </label>
          );
        })}
      </div>
    </>
  );
};

export const TriggerEditor = ({ value, onChange, name }) => {
  const updateTrigger = (id, key, val) => {
    onChange(
      value.map((event, eid) => {
        if (eid === id) {
          event[key] = val;
        }
        return event;
      })
    );
  };

  const addTrigger = () => {
    onChange([
      ...value,
      {
        type: "httpGet",
        path: `/${name.toLowerCase()}`,
        rate: "30 minutes",
        cron: "0 * * * ? *",
      },
    ]);
  };

  const removeTrigger = (id) => {
    onChange(value.filter((event, eid) => eid !== id));
  };

  return (
    <>
      <div className="block font-medium text-gray-500 mb-1">Event triggers</div>
      <div>
        {(value || []).map((event, id) => (
          <div className="flex gap-2 mb-3 items-center">
            {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select
              className="border-gray-300 rounded-md"
              value={event.type}
              onChange={(e) => updateTrigger(id, "type", e.target.value)}
            >
              <optgroup label="API Gateway">
                <option value="httpAny">HTTP ANY</option>
                <option value="httpGet">HTTP GET</option>
                <option value="httpPost">HTTP POST</option>
                <option value="httpPut">HTTP PUT</option>
                <option value="httpDelete">HTTP DELETE</option>
              </optgroup>
              <optgroup label="EventBridge">
                <option value="scheduleRate">Schedule rate</option>
                <option value="scheduleCron">Schedule cron</option>
                <option value="eventBridgeSource">
                  EventBridge default bus
                </option>
                <option value="eventBridgeBus">EventBridge custom bus</option>
              </optgroup>
              <optgroup label="S3">
                <option value="s3ObjectCreated">S3 Object created</option>
              </optgroup>
            </select>
            <TriggerProperties
              event={event}
              onChange={(key, val) => updateTrigger(id, key, val)}
            />
            <span>
              <Trash
                onClick={() => removeTrigger(id)}
                color="#f92672"
                size={18}
              />
            </span>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex items-center mt-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={addTrigger}
        >
          Add trigger
        </button>
      </div>
    </>
  );
};

export const TriggerProperties = ({ event, onChange }) => {
  switch (event.type) {
    case "httpAny":
    case "httpGet":
    case "httpPost":
    case "httpPut":
    case "httpDelete":
      return (
        <>
          <input
            type="text"
            title="Endpoint"
            className="border-gray-300 rounded-md w-full"
            value={event.path || ""}
            onChange={(e) => onChange("path", e.target.value)}
            placeholder="/my-endpoint"
          />
          <span>
            <HelpCircle
              size={18}
              color="#355fc5"
              onClick={() =>
                window.open(
                  "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html"
                )
              }
            />
          </span>
        </>
      );
    case "scheduleRate":
      return (
        <>
          <input
            type="text"
            title="Rate expression"
            className="border-gray-300 rounded-md w-full"
            value={event.rate || ""}
            onChange={(e) => onChange("rate", e.target.value)}
            placeholder="30 minutes"
          />
          <span>
            <HelpCircle
              size={18}
              color="#355fc5"
              onClick={() =>
                window.open(
                  "https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html#rate-expressions"
                )
              }
            />
          </span>
        </>
      );
    case "scheduleCron":
      return (
        <>
          <input
            type="text"
            title="Cron expression"
            className="border-gray-300 rounded-md w-full"
            value={event.cron || ""}
            onChange={(e) => onChange("cron", e.target.value)}
            placeholder="* * * * ? *"
          />
          <span>
            <HelpCircle
              size={18}
              color="#355fc5"
              onClick={() =>
                window.open(
                  "https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html#cron-expressions"
                )
              }
            />
          </span>
        </>
      );
    case "eventBridgeSource":
      return (
        <>
          <input
            type="text"
            title="Event source filter"
            className="border-gray-300 rounded-md w-full"
            value={event.source || ""}
            onChange={(e) => onChange("source", e.target.value)}
            placeholder="my.source"
          />
          <span>
            <HelpCircle
              size={18}
              color="#355fc5"
              onClick={() =>
                window.open(
                  "https://docs.aws.amazon.com/eventbridge/latest/userguide/filtering-examples-structure.html#filtering-match-values"
                )
              }
            />
          </span>
        </>
      );
    case "eventBridgeBus":
      return (
        <>
          <input
            type="text"
            title="Event bus"
            className="border-gray-300 rounded-md w-full"
            value={event.bus || "default"}
            onChange={(e) => onChange("bus", e.target.value)}
            placeholder="default"
          />
          <span>
            <HelpCircle
              size={18}
              color="#355fc5"
              onClick={() =>
                window.open(
                  "https://docs.aws.amazon.com/eventbridge/latest/userguide/filtering-examples-structure.html#filtering-match-values"
                )
              }
            />
          </span>
        </>
      );
    case "s3ObjectCreated":
      return (
        <>
          <input
            type="text"
            title="Bucket name"
            className="border-gray-300 rounded-md w-full"
            value={event.bucket || ""}
            onChange={(e) => onChange("bucket", e.target.value)}
            placeholder="bucket name"
          />
          <span>
            <HelpCircle
              size={18}
              color="#355fc5"
              onClick={() =>
                window.open(
                  "https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#notification-how-to-event-types-and-destinations"
                )
              }
            />
          </span>
        </>
      );
    default:
      return null;
  }
};
