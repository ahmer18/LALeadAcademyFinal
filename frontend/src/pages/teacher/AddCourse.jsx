import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useFeedback } from "../../providers/FeedbackProvider";
import { FaPlus, FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import handleUpload from "../../utils/ImageUploadApi";
import handleFileUpload from "../../utils/FileUploadApi";

export default function AddCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();
  const isUpdate = !!id;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      outcomes: [{ value: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "outcomes",
  });

  // Fetch course data if in update mode
  const { data: course, isLoading: isFetching } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/courses/${id}`);
      return res.data.course;
    },
    enabled: isUpdate,
  });

  // Pre-fill form when course data is loaded
  useEffect(() => {
    if (course) {
      const formattedOutcomes = course.outcomes?.map(val => ({ value: val })) || [{ value: "" }];
      reset({
        ...course,
        outcomes: formattedOutcomes,
      });
    }
  }, [course, reset]);

  const uploadImageMutation = useMutation({
    mutationFn: handleUpload,
  });

  const saveCourseMutation = useMutation({
    mutationFn: async (courseData) => {
      if (isUpdate) {
        const res = await axiosSecure.patch(`/courses/${id}`, courseData);
        return res.data;
      } else {
        const res = await axiosSecure.post(`/courses/add`, courseData);
        return res.data;
      }
    },
    onSuccess: () => {
      showFeedback(isUpdate ? "Course updated successfully!" : "Course added successfully!", "success");
      reset();
      navigate("/dashboard/courses");
    },
  });

  const onSubmit = async (data) => {
    try {
      // 1. Upload Thumbnail (Image) - only if a new file is selected
      let imageUrl = course?.image;
      if (data.image && data.image.length > 0 && typeof data.image[0] !== 'string') {
        const imageFile = data.image[0];
        imageUrl = await uploadImageMutation.mutateAsync(imageFile);
      }

      // 2. Upload Certificate (PDF) - only if a new file is selected
      let certificateUrl = course?.certificateUrl;
      if (data.certificate && data.certificate.length > 0 && typeof data.certificate[0] !== 'string') {
        const certFile = data.certificate[0];
        certificateUrl = await handleFileUpload(certFile);
      }

      const formattedOutcomes = data.outcomes
        .map((obj) => obj.value.trim())
        .filter((val) => val !== "");

      const finalData = {
        ...data,
        image: imageUrl,
        certificateUrl: certificateUrl,
        outcomes: formattedOutcomes,
        instructorEmail: user?.email,
      };

      if (!isUpdate) {
        finalData.rating = Math.floor(Math.random() * 5) + 1;
      }

      delete finalData.name;
      delete finalData.certificate; // Remove the file object
      delete finalData._id; // _id is immutable
      delete finalData.instructor; // This is a populated field, not needed for update
      
      saveCourseMutation.mutate(finalData);
    } catch (error) {
      console.error("Course submission failed:", error);
      showFeedback(error.message || "Process failed. Please check your files.", "error");
    }
  };

  if (isUpdate && isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="loading loading-spinner loading-lg text-blue-900"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">

        {/* Header Section */}
        <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 dark:text-blue-400 tracking-tight">
            {isUpdate ? "Update Course Details" : "Create New Course"}
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
            {isUpdate 
              ? "Modify your curriculum details to keep them up to date."
              : "Fill in the details below to launch your professional curriculum."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-10 space-y-8">

          {/* Title Field */}
          <div className="form-control w-full">
            <label className="label mb-2">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">Course Title</span>
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="e.g. Strategic Management Masterclass"
              className="input input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
            />
            {errors.title && <span className="text-red-500 text-xs mt-1 font-semibold">Title is required</span>}
          </div>

          {/* Dynamic Learning Outcomes Section */}
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-700">
            <label className="label mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">Learning Outcomes</span>
            </label>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="group flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex-grow relative">
                    <input
                      {...register(`outcomes.${index}.value`, { required: true })}
                      placeholder={`Point #${index + 1}`}
                      className="input input-bordered w-full rounded-xl bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => append({ value: "" })}
              className="btn btn-sm mt-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-blue-900 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl gap-2 capitalize"
            >
              <FaPlus size={10} /> Add Learning Point
            </button>
          </div>

          {/* Price, Duration & Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="form-control">
              <label className="label mb-2">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">Price (£)</span>
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                className="input input-bordered rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-control">
              <label className="label mb-2">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">Duration</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 5 Hrs or 10 Modules"
                {...register("duration", { required: true })}
                className="input input-bordered rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="form-control">
              <label className="label mb-2 justify-between flex items-center">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">Course Thumbnail</span>
                {isUpdate && course?.image && (
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Current Image Active</span>
                )}
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  {...register("image", { required: !isUpdate })}
                  className="file-input file-input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 file:bg-blue-800  file:text-white file:border-none file:mr-4 file:px-4 focus:ring-2 focus:ring-blue-500 transition-all font-medium text-xs"
                />
                {isUpdate && course?.image && (
                  <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <img src={course.image} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt="Existing" />
                     <p className="text-[10px] text-slate-400 font-bold leading-tight">Leave empty to keep existing <br/>professional cover</p>
                  </div>
                )}
              </div>
            </div>
            <div className="form-control col-span-1 sm:col-span-3">
              <label className="label mb-2 justify-between flex items-center">
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">Course Certificate (PDF)</span>
                {isUpdate && course?.certificateUrl && (
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Certificate Found</span>
                     <a href={course.certificateUrl} target="_blank" rel="noreferrer" className="text-[9px] font-black text-blue-800 underline hover:text-blue-600 uppercase tracking-tighter">View Existing</a>
                  </div>
                )}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  {...register("certificate")}
                  className="file-input file-input-bordered w-full rounded-xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 file:bg-emerald-600 file:text-white file:border-none file:mr-4 file:px-4 font-medium text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium italic">
                  {isUpdate ? "Upload a new PDF only if you wish to replace the current certificate." : "This certificate will be issued to students upon successful completion."}
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="form-control w-full flex flex-col gap-2">
            <label className="label">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">Course Vision</span>
            </label>
            <textarea
              {...register("description", { required: true })}
              className="textarea textarea-bordered w-full h-44 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-base p-5 leading-relaxed"
              placeholder="What is the core mission of this course? Describe the impact on the students..."
            ></textarea>
            {errors.description && <span className="text-red-500 text-xs font-semibold mt-1">Description is required</span>}
          </div>

          {/* Course Completion Message Section */}
          <div className="form-control w-full flex flex-col gap-2">
            <label className="label">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">Course Completion Message</span>
            </label>
            <textarea
              {...register("courseCompletionMessage")}
              className="textarea textarea-bordered w-full h-32 rounded-2xl bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all text-base p-5 leading-relaxed"
              placeholder="This message will be shown to students when they complete the entire course..."
            ></textarea>
          </div>

          {/* Submit Action */}
          <div className="pt-6">
            <button
              type="submit"
              className="btn btn-primary w-full h-16 rounded-2xl text-lg font-bold uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 border-none bg-blue-800 hover:bg-blue-700 text-white"
              disabled={uploadImageMutation.isPending || saveCourseMutation.isPending}
            >
              {uploadImageMutation.isPending || saveCourseMutation.isPending ? (
                <div className="flex items-center gap-3">
                  <span className="loading loading-spinner"></span>
                  <span>{isUpdate ? "Saving Changes..." : "Uploading Data..."}</span>
                </div>
              ) : (
                isUpdate ? "Update Professional Course" : "Publish Professional Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}