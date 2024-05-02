using Microsoft.AspNetCore.Authentication.Negotiate;
using Microsoft.EntityFrameworkCore;
using TaskManager.Configuration;
using TaskManager.DataAccess;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var dbSettings = builder.Configuration
	.GetSection(nameof(TaskManagerDataBaseOptions))
	.Get<TaskManagerDataBaseOptions>();

builder.Services.AddDbContext<TaskManagerDbContext>(options =>
	options.UseSqlServer(dbSettings!.ConnectionString));

builder.Services.AddMvc();

builder.Services.AddAuthentication(NegotiateDefaults.AuthenticationScheme)
	 .AddNegotiate();

builder.Services.AddAuthorization(options =>
{
	// By default, all incoming requests will be authorized according to the default policy.
	options.FallbackPolicy = options.DefaultPolicy;
});
builder.Services.AddRazorPages();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}
else
{
	app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}"
	);

app.Run();

