"use client";

import type { ReadinessTestFieldAnswer } from "@/features/readiness-test/field-answers";
import {
  getUploadSettings,
  getWordLimitSettings,
} from "@/features/readiness-test/field-answers";
import type { ReadinessTestFormField } from "@/features/readiness-test/types";

type ReadinessTestFieldProps = {
  field: ReadinessTestFormField;
  value: ReadinessTestFieldAnswer | undefined;
  onChange: (value: ReadinessTestFieldAnswer) => void;
};

const fieldClassName =
  "w-full rounded-xl border border-[#D0DAE0] bg-white px-3 py-2.5 text-sm text-[#193B46] outline-none focus:border-[#1E7C8D]";

function ChoiceOptions({
  field,
  value,
  onChange,
  inputType,
}: ReadinessTestFieldProps & {
  inputType: "radio" | "checkbox";
}) {
  const selectedValues = inputType === "checkbox"
    ? (Array.isArray(value) ? value : [])
    : [];

  return (
    <div className="mt-4 space-y-2">
      {field.options.map((option) => {
        const checked =
          inputType === "radio"
            ? value === option.label
            : selectedValues.includes(option.label);

        return (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              checked
                ? "bg-[#D4EAF0] text-[#1F5865]"
                : "bg-[#E4ECEF] text-[#6E818A]"
            }`}
          >
            <input
              type={inputType}
              name={String(field.id)}
              value={option.label}
              checked={checked}
              onChange={() => {
                if (inputType === "radio") {
                  onChange(option.label);
                  return;
                }

                onChange(
                  checked
                    ? selectedValues.filter((item) => item !== option.label)
                    : [...selectedValues, option.label],
                );
              }}
              className="size-3.5 accent-[#1E7C8D]"
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

const ReadinessTestField = ({ field, value, onChange }: ReadinessTestFieldProps) => {
  const wordLimits = getWordLimitSettings(field.settings);
  const uploadSettings = getUploadSettings(field.settings);
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="rounded-2xl bg-[#EEF4F6] p-4">
      <h3 className="text-3xl leading-tight font-semibold text-[#193B46]">
        {field.label}
      </h3>
      {field.description ? (
        <p className="mt-2 text-sm font-medium text-[#5E737D]">{field.description}</p>
      ) : null}

      {field.type === "single_choice" ? (
        <ChoiceOptions
          field={field}
          value={value}
          onChange={onChange}
          inputType="radio"
        />
      ) : null}

      {field.type === "multiple_choice" ? (
        <ChoiceOptions
          field={field}
          value={value}
          onChange={onChange}
          inputType="checkbox"
        />
      ) : null}

      {field.type === "dropdown" ? (
        <select
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} mt-4`}
        >
          <option value="">Select an option</option>
          {field.options.map((option) => (
            <option key={option.id} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      {field.type === "short_answer" || field.type === "long_answer" ? (
        <textarea
          value={stringValue}
          rows={field.type === "long_answer" ? 8 : 4}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} mt-4 resize-y`}
          placeholder="Type your answer"
        />
      ) : null}

      {field.type === "single_text" ? (
        <input
          type="text"
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} mt-4`}
          placeholder="Type your answer"
        />
      ) : null}

      {field.type === "phone" ? (
        <input
          type="tel"
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} mt-4`}
          placeholder="Enter phone number"
        />
      ) : null}

      {field.type === "url" ? (
        <input
          type="url"
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} mt-4`}
          placeholder="https://"
        />
      ) : null}

      {field.type === "calendar" ? (
        <input
          type="date"
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} mt-4`}
        />
      ) : null}

      {field.type === "time" ? (
        <input
          type="time"
          value={stringValue}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClassName} mt-4`}
        />
      ) : null}

      {field.type === "upload" ? (
        <div className="mt-4">
          <input
            type="file"
            accept={
              uploadSettings?.allowed_types
                .map((type) => `.${type}`)
                .join(",") ?? undefined
            }
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            className={`${fieldClassName} file:mr-3 file:rounded-md file:border-0 file:bg-[#D4EAF0] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#1F5865]`}
          />
          {uploadSettings ? (
            <p className="mt-2 text-xs font-medium text-[#6E818A]">
              Max size: {uploadSettings.size_limit_mb}MB. Allowed:{" "}
              {uploadSettings.allowed_types.join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}

      {wordLimits ? (
        <p className="mt-2 text-xs font-medium text-[#6E818A]">
          {wordLimits.min_words}–{wordLimits.max_words} words
        </p>
      ) : null}
    </div>
  );
};

export default ReadinessTestField;
